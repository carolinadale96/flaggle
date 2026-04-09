import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      }}
    >
      {/* Pole */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 38,
          width: 9,
          height: 104,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 5,
          display: "flex",
        }}
      />
      {/* Finial */}
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 33,
          width: 20,
          height: 20,
          background: "rgba(255,255,255,0.95)",
          borderRadius: "50%",
          display: "flex",
        }}
      />
      {/* Flag body */}
      <div
        style={{
          position: "absolute",
          left: 69,
          top: 47,
          width: 72,
          height: 43,
          background: "rgba(255,255,255,0.95)",
          borderRadius: "0 6px 9px 0",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  );
}
