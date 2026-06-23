import { ImageResponse } from "next/og";

export const alt =
  "Fiomio · Le soin K-beauty choisi pour votre peau et le climat de votre ville";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fbfbf6",
          backgroundImage:
            "radial-gradient(720px 520px at 82% 12%, rgba(172,214,205,0.55), transparent 70%)",
          padding: "70px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#2f6b52",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 99, background: "#2f6b52" }} />
          Diagnostic peau × climat de votre ville
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 600,
              color: "#0f2b31",
              letterSpacing: -2,
              lineHeight: 1.06,
            }}
          >
            <div style={{ display: "flex" }}>La K-beauty décodée</div>
            <div style={{ display: "flex" }}>
              pour&nbsp;<span style={{ color: "#2f6b52" }}>votre peau</span>,
            </div>
            <div style={{ display: "flex" }}>
              et le climat de&nbsp;<span style={{ color: "#5f9485" }}>votre ville</span>.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 28,
              color: "#5f6b66",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Climat × Peau × Actifs → une recommandation personnalisée et expliquée.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#8a948f",
            fontSize: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              fontSize: 40,
              fontWeight: 700,
              color: "#0f2b31",
              letterSpacing: -1,
            }}
          >
            fiomio
            <div style={{ width: 14, height: 14, borderRadius: 99, background: "#2f6b52", marginBottom: 9 }} />
          </div>
          <div style={{ display: "flex" }}>fiomio.io</div>
        </div>
      </div>
    ),
    size,
  );
}
