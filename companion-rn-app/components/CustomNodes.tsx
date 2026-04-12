import { Handle, Position } from "@xyflow/react";
import React from "react";

interface CustomNodeProps {
  data: {
    label: string;
    type: "prevention" | "risk" | "location";
    probability: number;
    style: React.CSSProperties;
  };
  isConnectable: boolean;
}

const CustomNode = ({ data, isConnectable }: CustomNodeProps) => {
  const isPrevention = data.type === "prevention";
  const isRisk = data.type === "risk";

  return (
    <div
      style={{
        ...data.style,
        padding: "10px",
        textAlign: "center",
        minWidth: "100px",
        borderRadius: 20,
      }}
    >
      <Handle
        type="target"
        position={isPrevention ? Position.Bottom : Position.Top}
        id={isPrevention ? "target-bottom" : "target-top"}
        isConnectable={isConnectable}
        style={{ background: isPrevention ? "#0070d3ff" : "#555" }}
      />

      <div
        style={{
          fontWeight: "bold",
          fontSize: "12px",
          marginBottom: 4,
          maxWidth: 100,
        }}
      >
        {data.label}
      </div>

      {!isPrevention && (
        <div
          style={{
            fontSize: "8px",
          }}
        >
          {data.probability < 1 ? data.probability : data.probability / 10}
        </div>
      )}

      {!isPrevention && (
        <Handle
          type="source"
          position={Position.Top}
          id="source-top"
          style={{ right: "30%", background: "#888" }}
          isConnectable={isConnectable}
        />
      )}

      {!isPrevention && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="source-bottom"
          style={{ left: "50%", background: "#555" }}
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
};

export default CustomNode;
