import React, { useEffect } from "react";

const LoadingComponent = () => {
  useEffect(() => {
    console.log("loading");
  }, []);
  // We define the keyframes in a string to inject into a style tag
  const animationStyles = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .loading-svg {
      animation: rotate 0.8s linear infinite;
    }
  `;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(4px)",
        transform: "translate(-50%,-50%)",
        zIndex: 100,
        height: 280,
        width: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        flexDirection: "column",
        gap: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <style>{animationStyles}</style>
      <h2
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: "600",
          color: "#1a1a1a",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Calculating Graph...
      </h2>
      <svg
        className="loading-svg"
        viewBox="0 0 80 80"
        style={{
          height: 80,
          width: 80,
          overflow: "visible",
        }}
      >
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="#eee"
          strokeWidth="5"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="rgb(114, 63, 235)"
          strokeWidth="5"
          strokeDasharray="50, 150"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        style={{
          fontSize: "13px",
          color: "#888",
          fontWeight: "400",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        This may take a moment...
      </span>
    </div>
  );
};

export default LoadingComponent;
