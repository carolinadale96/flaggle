import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 512,
        height: 512,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
        borderRadius: 112,
      }}
    >
      {/* Pole */}
      <div
        style={{
          position: "absolute",
          left: 172,
          top: 112,
          width: 24,
          height: 288,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 12,
          display: "flex",
        }}
      />
      {/* Finial */}
      <div
        style={{
          position: "absolute",
          left: 158,
          top: 100,
          width: 52,
          height: 52,
          background: "rgba(255,255,255,0.95)",
          borderRadius: "50%",
          display: "flex",
        }}
      />
      {/* Flag body */}
      <div
        style={{
          position: "absolute",
          left: 196,
          top: 136,
          width: 200,
          height: 120,
          background: "rgba(255,255,255,0.95)",
          borderRadius: "0 16px 24px 0",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  );
}
