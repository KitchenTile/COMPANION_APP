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
        backgroundColor: "white",
        border: "2px solid #ccc",
        transform: "translate(-50%,-50%)",
        zIndex: 10,
        height: 300,
        width: 300,
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "column",
        gap: 60,
      }}
    >
      <style>{animationStyles}</style>
      <h2>Calculating Graph...</h2>
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
    </div>
  );
};

export default LoadingComponent;
