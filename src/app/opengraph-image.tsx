import { ImageResponse } from "next/og";

export const alt = "Fiomio — Intelligence skincare adaptative · Korean Insider × Paris Observer";
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
          backgroundColor: "#0c0d0c",
          backgroundImage:
            "radial-gradient(600px 400px at 78% 22%, rgba(0,255,127,0.18), transparent 70%)",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#00ff7f",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 99, background: "#00ff7f" }} />
          Korean Insider × Paris Observer
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              color: "#fbfbf6",
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            La K-beauty décodée pour{" "}
            <span style={{ color: "#00ff7f" }}>votre peau</span>.
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
          <div style={{ fontSize: 40, fontWeight: 700, color: "#fbfbf6", letterSpacing: -1 }}>
            fiomio
          </div>
          <div>fiomio.io</div>
        </div>
      </div>
    ),
    size,
  );
}
