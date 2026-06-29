#!/usr/bin/env python3
"""Rebuild the Stylevana-backed catalogue from the Awin Stylevana FR product feed.

Usage:
  python3 scripts/build_stylevana_catalog.py <feed.csv | feed_url>

Outputs (overwritten):
  src/lib/stylevana-products.ts   curated/sv id -> tracked deeplink + price
  src/lib/stylevana-catalog.ts    expanded SV_PRODUCTS[] tagged to actives

Only in-stock products are used so every recommendation resolves to a real page.
Re-run weekly to refresh prices/stock with a fresh feed.
"""
import csv, re, sys, io, unicodedata, urllib.request, gzip
from collections import defaultdict

ROOT = __file__.rsplit("/scripts/", 1)[0]
CAP = 25

def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()

PACK_RE = [re.compile(r"\((\d+)\s*ea\)"), re.compile(r"(\d+)\s*ea\b"), re.compile(r"(\d+)\s*pcs?\b"),
           re.compile(r"(\d+)\s*pieces?\b"), re.compile(r"lot de (\d+)"), re.compile(r"set of (\d+)"),
           re.compile(r"\bx\s*(\d+)\b"), re.compile(r"(\d+)\s*x\b"), re.compile(r"(\d+)\s*set\b")]
def pack_count(name):
    t = norm(name); best = 1
    for rx in PACK_RE:
        for m in rx.finditer(t):
            v = int(m.group(1))
            if 2 <= v <= 12: best = max(best, v)
    if best == 1 and re.search(r"\b(duo|double)\b", t): best = 2
    if best == 1 and re.search(r"\btrio\b", t): best = 3
    return best

KW = {
 "ceramides":["ceramide","ceramidin"],"hyaluronic":["hyaluron"],"niacinamide":["niacinamide"],
 "centella":["centella","cica","tiger grass"],"madecassoside":["madecass"],"panthenol":["panthenol","pro vitamin b5","provitamine b5"],
 "squalane":["squalane"],"snail":["snail","escargot","mucin","mucine"],"vitaminc":["vitamin c","vitamine c","ascorbic","ascorbique","ascorbyl","vita c"],
 "azelaic":["azelaic","azelaique","azeloyl"],"salicylic":["salicylic","salicylique"],"retinol":["retinol"],"retinal":["retinal","retinaldehyde"],
 "peptides":["peptide"],"allantoin":["allantoin"],"betaglucan":["beta glucan","beta-glucan","betaglucan","beta glucane","beta-glucane"],
 "mugwort":["mugwort","artemisia","armoise"],"heartleaf":["heartleaf","houttuynia"],"greentea":["green tea","the vert","matcha","egcg"],
 "galactomyces":["galactomyces","pitera"],"propolis":["propolis"],"bakuchiol":["bakuchiol"],"tranexamic":["tranexamic","tranexamique"],
 "arbutin":["arbutin","arbutine"],"mandelic":["mandelic","mandelique"],"glycolic":["glycolic","glycolique"],"lactic":["lactic acid","acide lactique"],
 "pha":["gluconolactone"],"adenosine":["adenosine"],"tocopherol":["tocopherol","vitamin e","vitamine e"],"ferulic":["ferulic","ferulique"],
 "licorice":["licorice","reglisse","glabridin","glycyrrhiza"],"zincpca":["zinc pca"],"polyglutamic":["polyglutamic","polyglutamique"],
 "ginseng":["ginseng","panax"],"rice":["rice","riz","oryza"],"ectoin":["ectoin","ectoine"],"urea":["urea","uree"],"resveratrol":["resveratrol"],
 "q10":["q10","ubiquinone"],"lactobionic":["lactobionic","lactobionique"],"kojic":["kojic","kojique"],"caffeine":["caffeine","cafeine"],
 "sheabutter":["shea butter","karite"],"pdrn":["pdrn","salmon dna","polynucleotide"],"collagen":["collagen","collagene"],
 "teatree":["tea tree","arbre a the","melaleuca"],"aloe":["aloe"],"bifida":["bifida"],"cholesterol":["cholesterol"],
 "glutathione":["glutathione","glutathion"],"mulberry":["mulberry","murier"],"oat":["oat","avoine"],"witchhazel":["witch hazel","hamamelis"],
 "jojoba":["jojoba"],"rosehip":["rosehip","rose musquee","rosa canina"],"calendula":["calendula"],"snowmushroom":["snow mushroom","tremella"],
 "betaine":["betaine"],"linoleic":["linoleic","linoleique","vitamin f","vitamine f"],"honey":["honey","miel"],"clay":["clay","argile","kaolin","bentonite"],
 "charcoal":["charcoal","charbon"],"sulfur":["sulfur","soufre"],"algae":["algae","algue","kelp","laminaria","seaweed"],"argan":["argan"],
 "exosome":["exosome"],"seabuckthorn":["sea buckthorn","seabuckthorn","argousier","hippophae"],"ginkgo":["ginkgo"],"enzyme":["enzyme","papain","bromelain"],
 "edelweiss":["edelweiss"],"willowbark":["willow bark","ecorce de saule","salix"],
}
PATS = {a:[re.compile(r"\b"+re.escape(norm(k))+r"\b") for k in ks] for a,ks in KW.items()}
EXCLUDE = [re.compile(r"\b"+re.escape(x)+r"\b") for x in
 ["maquillage","rouge a levres","levres","mascara","fond de teint","cushion","correcteur","blush","eyeliner","crayon",
  "vernis","shampoing","apres shampoing","cheveux","hair","brosse","eponge","accessoire","outil","complement","supplement",
  "gummies","parfum","bougie","ongle","nail","corps","body wash","gel douche","savon corps","coffret cadeau"]]
ALIAS = {"purito":"purito seoul","klairs":"dear klairs","by wishtrend":"bywishtrend"}
CATKW = [("sunscreen",["spf","sunscreen","sun cream","solaire","ecran solaire"," uv ","sun stick","sun serum","sun milk"]),
 ("cleanser",["cleanser","cleansing","nettoyant","mousse","foam","demaquillant","oil cleanser","cleansing balm","cleansing oil"]),
 ("mask",["sheet mask","masque","sleeping mask","wash off"," mask","patch"]),
 ("toner",["toner","tonique","toning"]),("essence",["essence"]),
 ("serum",["serum","ampoule","booster","concentre"]),
 ("moisturizer",["cream","creme","moisturizer","moisturiser","hydratant","emulsion","lotion","baume","butter"])]
CATFR = {"cleanser":"Nettoyant","toner":"Tonique","essence":"Essence","serum":"Serum","moisturizer":"Creme","sunscreen":"Protection solaire","treatment":"Soin cible","mask":"Masque"}
CATEN = {"cleanser":"cleanser","toner":"toner","essence":"essence","serum":"serum","moisturizer":"moisturizer","sunscreen":"sunscreen","treatment":"targeted care","mask":"mask"}

def in_stock(r): return r.get("in_stock","") in ("1","yes","Y","true") or r.get("is_for_sale","") in ("1","yes","Y","true")
def actives_for(name, sdesc):
    t = norm(name+" "+sdesc)
    if any(p.search(t) for p in EXCLUDE): return []
    return [a for a,ps in PATS.items() if any(p.search(t) for p in ps)]
def category(name):
    t = norm(name)
    for cat,kws in CATKW:
        if any(k.strip() in t for k in kws): return cat
    return "treatment"
def toks(s,b): return set(norm(s).split())-set(norm(b).split())-{"ml","g","pcs","x","set","de","la","le"}
def clean_name(pn,brand):
    n = re.sub(r"\[[^\]]*\]","",pn).strip()
    parts = [p.strip() for p in n.split(" - ") if p.strip()]
    nb = norm(brand)
    out = [p for p in parts if norm(p)!=nb and not re.search(r"\d+\s*(ml|g|ea|pcs|piece|capsules?)\b",norm(p)) and norm(p) not in ("set","offres","offre")]
    return (" - ".join(out) if out else n)[:80]
def esc(s): return (s or "").replace("\\","\\\\").replace('"','\\"')

def load_feed(src):
    if src.startswith("http"):
        data = urllib.request.urlopen(src, timeout=120).read()
        if src.endswith(".gz") or data[:2]==b"\x1f\x8b": data = gzip.decompress(data)
        return list(csv.DictReader(io.StringIO(data.decode("utf-8","ignore"))))
    with open(src, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

def main(src):
    rows = load_feed(src)
    idx = defaultdict(list)
    for r in rows: idx[norm(r.get("brand_name",""))].append(r)
    # active display names from ingredients.ts
    itxt = open(ROOT+"/src/lib/ingredients.ts",encoding="utf-8").read()
    AN = {m.group(1):(re.sub(r"\s*\([^)]*\)","",m.group(2)).strip(), re.sub(r"\s*\([^)]*\)","",m.group(3)).strip())
          for m in re.finditer(r'id:\s*"([a-z0-9]+)"\s*,\s*name:\s*\{\s*fr:\s*"([^"]+)",\s*en:\s*"([^"]+)"',itxt)}
    # curated products
    ptxt = open(ROOT+"/src/lib/products.ts",encoding="utf-8").read()
    body = ptxt[ptxt.index("export const PRODUCTS"):]
    curated = [{"id":m.group(1),"brand":m.group(2),"name":m.group(3)}
               for m in re.finditer(r'\{\s*id:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*name:\s*"([^"]+)"',body)]
    curated_base = set(norm(c["brand"])+"|"+" ".join(norm(c["name"]).split()[:3]) for c in curated)
    links = {}
    for p in curated:
        nb = ALIAS.get(norm(p["brand"]),norm(p["brand"]))
        cands = idx.get(nb,[])
        if not cands: continue
        ct = toks(p["name"],p["brand"]); best=None; bkey=None; bsc=-1
        for row in cands:
            sc = len(ct & toks(row.get("product_name",""),p["brand"]))
            key = (sc, 1 if pack_count(row.get("product_name",""))==1 else 0, 1 if in_stock(row) else 0, -len(row.get("product_name","")))
            if best is None or key>bkey: best,bkey,bsc = row,key,sc
        if best is None or bsc<1: continue
        links[p["id"]] = {"url":best["aw_deep_link"].strip(),"price":best.get("search_price","").strip(),"cur":best.get("currency","EUR").strip() or "EUR"}
        if pack_count(best.get("product_name",""))>1: links[p["id"]]["pack"]=pack_count(best.get("product_name",""))
    # expanded set
    cand = [r for r in rows if in_stock(r) and actives_for(r.get("product_name",""), r.get("product_short_description","") or "")]
    def core(r):
        n = norm(r.get("product_name",""))
        promo = 1 if any(k in n for k in ("offre","mini","sample","kit","set","coffret","ensemble","double")) else 0
        multi = 1 if pack_count(r.get("product_name",""))>1 else 0
        return (multi, promo, len(n))
    cand.sort(key=core)
    percat={}; seen=set(); gen=[]
    for r in cand:
        brand=(r.get("brand_name") or "").strip()
        acts=actives_for(r.get("product_name",""), r.get("product_short_description","") or "")
        cn=clean_name(r.get("product_name",""),brand)
        base=norm(brand)+"|"+" ".join(norm(cn).split()[:3])
        if not brand or not cn or base in seen or base in curated_base: continue
        if not any(percat.get(a,0)<CAP for a in acts): continue
        seen.add(base)
        for a in acts: percat[a]=percat.get(a,0)+1
        pid="sv-"+(r.get("aw_product_id") or r.get("merchant_product_id") or str(len(gen))).strip()
        gen.append({"id":pid,"brand":brand,"name":cn,"acts":acts,"cat":category(r.get("product_name","")),
                    "url":(r.get("aw_deep_link") or "").strip(),"price":(r.get("search_price") or "").strip()})
        links[pid]={"url":gen[-1]["url"],"price":gen[-1]["price"],"cur":"EUR"}
        pk=pack_count(r.get("product_name",""))
        if pk>1: links[pid]["pack"]=pk
    # write link map
    out=['// AUTO-GENERATED by scripts/build_stylevana_catalog.py from the Awin Stylevana FR feed.',
         '// Curated/sv id -> tracked deeplink + price (EUR). Only in-stock products.',
         'export type StylevanaLink = { url: string; price?: string; cur?: string; pack?: number };',
         'export const STYLEVANA: Record<string, StylevanaLink> = {']
    for pid,v in links.items():
        parts=[f'url: "{esc(v["url"])}"']
        if v.get("price"): parts+=[f'price: "{esc(v["price"])}"',f'cur: "{esc(v.get("cur","EUR") or "EUR")}"']
        if v.get("pack"): parts.append(f'pack: {int(v["pack"])}')
        out.append(f'  "{esc(pid)}": {{ {", ".join(parts)} }},')
    out.append('};')
    open(ROOT+"/src/lib/stylevana-products.ts","w",encoding="utf-8").write("\n".join(out)+"\n")
    # write expanded catalogue
    def sq(brand,name):
        b=brand.lower(); t=[x for x in re.sub(r"[^A-Za-z0-9\s]"," ",name).split() if x.lower()!=b][:2]
        return " ".join([brand]+t).strip()
    cat=['import type { Product } from "./products";','',
         '// AUTO-GENERATED by scripts/build_stylevana_catalog.py. In-stock skincare',
         '// tagged to actives by keyword; links/prices in stylevana-products.ts.',
         'export const SV_PRODUCTS: Product[] = [']
    for c in gen:
        afr,aen=AN.get(c["acts"][0],(c["acts"][0],c["acts"][0]))
        bfr=f'{CATFR[c["cat"]]} a base de {afr.lower()}.'; ben=f'{aen} {CATEN[c["cat"]]}.'
        ings=", ".join(f'"{a}"' for a in c["acts"])
        cat.append('  { id: "%s", brand: "%s", name: "%s", searchQ: "%s", ingredientIds: [%s], category: "%s", blurb: { fr: "%s", en: "%s" } },'%(
            esc(c["id"]),esc(c["brand"]),esc(c["name"]),esc(sq(c["brand"],c["name"])),ings,c["cat"],esc(bfr),esc(ben)))
    cat.append('];')
    open(ROOT+"/src/lib/stylevana-catalog.ts","w",encoding="utf-8").write("\n".join(cat)+"\n")
    print(f"OK: {len(links)} links, {len(gen)} expanded products, {len({a for c in gen for a in c['acts']})} actives")

if __name__=="__main__":
    if len(sys.argv)<2:
        print("usage: build_stylevana_catalog.py <feed.csv|feed_url>"); sys.exit(1)
    main(sys.argv[1])
