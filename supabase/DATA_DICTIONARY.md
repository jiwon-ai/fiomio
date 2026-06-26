# Fiomio data dictionary (flywheel v2 / Phase 1)

The proprietary, anonymous dataset behind the future recommendation model. No
email, no IP, no fingerprinting. First-party random UUIDs only, clearable by the
user at any time.

## Versioning (on every event)
- `engine_version` - diagnostic scoring logic/weights generation. Bump in
  `src/lib/data-version.ts` whenever `src/lib/diagnostic.ts` or ingredient
  weights change, so generations are never mixed when training.
- `schema_version` - event payload shape. Bump when columns/meaning change.

## Funnel keys (stitch the journey, no PII)
- `anon_id` - persists across visits (localStorage). Stable "who".
- `session_id` - one visit (sessionStorage).
- `diag_id` - one completed diagnostic. Links diagnostic -> impressions -> clicks.

## Tables

### diagnostics  (one row per completed diagnostic)
| column | type | notes |
|---|---|---|
| diag_id | text | UUID, joins to impressions/clicks |
| skin_type | text | enum: dry \| combination \| oily \| normal |
| sensitive | bool | |
| concerns | text[] | concern keys (14-key taxonomy) |
| active_use | text | enum: none \| retinol \| acids \| vitc \| ... |
| gender | text | enum: female \| male \| other |
| pregnancy | text | enum: none \| pregnant \| trying |
| city, region | text | location context (no precise geo) |
| season | text | |
| temp_c, humidity, uv | float | climate snapshot at diagnostic time |
| recommended | text[] | active ids (legacy, kept for back-compat) |
| recommendations | jsonb | [{active_id, score, rank}] - scored + ranked |
| anon_id, session_id | text | funnel keys |
| engine_version, schema_version | text | versioning |
| created_at | timestamptz | |

### product_impressions  (one row per SHOWN product - CTR denominator + negatives)
diag_id, anon_id, session_id, product_id, brand, product_name, active_id,
rank (position in the shown list), source, city, season, temp_c, humidity, uv,
engine_version, schema_version, lang, created_at.

### product_clicks  (one row per product opened - the positive label)
product_name, brand, product_id, barcode, active_id, source, rank, diag_id,
anon_id, session_id, city, region, season, temp_c, humidity, uv,
engine_version, schema_version, lang, created_at.

### search_queries  (Affinites demand, incl. misses)
query, result_count, found, city, anon_id, session_id, schema_version, lang,
created_at.

## How to train later (the join)
For learning-to-rank / CTR:
`product_impressions` LEFT JOIN `product_clicks` ON (diag_id, product_id)
-> label = clicked (1) / not clicked (0), features from `diagnostics` (profile
x climate) joined on `diag_id`, candidate features from the product catalog
joined on `product_id`. Segment by `engine_version`.
