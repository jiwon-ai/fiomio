import { ImageResponse } from "next/og";

export const alt = "Fiomio · Le soin K-beauty choisi pour votre peau et la météo de votre ville";
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
          backgroundColor: "#0f2b31",
          backgroundImage:
            "radial-gradient(600px 400px at 78% 22%, rgba(203,239,77,0.20), transparent 70%)",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#cbef4d",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 99, background: "#cbef4d" }} />
          Diagnostic peau × météo de votre ville
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 600,
              color: "#fbfbf6",
              letterSpacing: -2,
              lineHeight: 1.08,
            }}
          >
            <div style={{ display: "flex" }}>La K-beauty décodée</div>
            <div style={{ display: "flex" }}>
              pour&nbsp;<span style={{ color: "#cbef4d" }}>votre peau</span>.
            </div>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 30,
              color: "rgba(251,251,246,0.62)",
              fontFamily: "system-ui, sans-serif",
              maxWidth: 880,
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
            color: "rgba(251,251,246,0.5)",
            fontSize: 26,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              fontSize: 40,
              fontWeight: 700,
              color: "#fbfbf6",
              letterSpacing: -1,
            }}
          >
            fiomio
            <div style={{ width: 15, height: 15, borderRadius: 99, background: "#cbef4d", marginBottom: 8 }} />
          </div>
          <div>fiomio.io</div>
        </div>
      </div>
    ),
    size,
  );
}
