import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Imagen para compartir en redes y WhatsApp (1200×630), con la identidad Graas.
 * Uso: /og?title=Furgones térmicos a medida&sub=Crespo, Entre Ríos
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Carrocerías hechas para trabajar").slice(0, 90);
  const sub = (searchParams.get("sub") || "Fábrica en Crespo, Entre Ríos, desde 1985").slice(0, 80);

  const dir = join(process.cwd(), "src/fonts/og");
  const [bold, label, regular, logo] = await Promise.all([
    readFile(join(dir, "Saira-ExpandedBold.ttf")),
    readFile(join(dir, "Saira-SemiCondensedSemiBold.ttf")),
    readFile(join(dir, "Saira-Regular.ttf")),
    readFile(join(process.cwd(), "public/brand/logo-graas.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0d0d0f", padding: "64px 72px", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: "#ffc21a" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${logo}`} width={84} height={84} style={{ borderRadius: 999 }} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "SairaBold", fontSize: 40, color: "#fff", lineHeight: 1 }}>GRAAS</span>
            <span style={{ fontFamily: "SairaLabel", fontSize: 20, color: "#ffc21a", letterSpacing: 5, marginTop: 6 }}>CARROCERÍAS</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontFamily: "SairaBold", fontSize: title.length > 40 ? 62 : 78, color: "#fff", lineHeight: 1.02, textTransform: "uppercase", maxWidth: 1040 }}>{title}</span>
          <span style={{ fontFamily: "SairaRegular", fontSize: 30, color: "#a3a3ab" }}>{sub}</span>
        </div>
        <span style={{ fontFamily: "SairaLabel", fontSize: 22, color: "#ffc21a", letterSpacing: 4 }}>HUGOGRAAS.COM.AR</span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "SairaBold", data: bold, weight: 700, style: "normal" },
        { name: "SairaLabel", data: label, weight: 600, style: "normal" },
        { name: "SairaRegular", data: regular, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    },
  );
}
