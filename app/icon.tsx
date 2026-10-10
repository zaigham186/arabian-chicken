import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e11d48 0%, #b91c1c 100%)",
        borderRadius: "8px",
        color: "#ffffff",
        fontSize: "18px",
        fontWeight: 800,
        boxShadow: "0 2px 8px rgba(225, 29, 72, 0.4)",
      }}
    >
      🍗
    </div>,
    {
      ...size,
    },
  );
}
