import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#f7f6f1",
          padding: "90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#c8102e",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          Normatiza
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            color: "#1c1b18",
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Formatação ABNT sem perder um dia inteiro nisso
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 28,
            color: "#6b675c",
          }}
        >
          Referências, editor e exportação formatada
        </div>
      </div>
    ),
    { ...size },
  );
}
