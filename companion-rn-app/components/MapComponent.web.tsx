import React, { useEffect, useMemo, useState } from "react";
import { ReactFlow, Panel, Background, Controls } from "@xyflow/react";
import * as d3 from "d3-hierarchy";
import "@xyflow/react/dist/style.css";
import { calculateRouteGraph } from "@/api/fetchAPI";
import transformDataForD3 from "@/utils/mapDataTransformer";
import { TreeNode } from "@/utils/types";
import LoadingComponent from "./LoadingComponent.web";

export default function App() {
  const [travelData, setTravelData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("Hendon Library, London NW4 4BQ");
  const [destination, setDestination] = useState("Brent Cross, London NW4 3AY");

  const getTravelData = async () => {
    if (origin == "" || destination == "") return;
    setLoading(true);
    const travelData = await calculateRouteGraph({
      origin: origin,
      destination: destination,
    });
    setTravelData(travelData);
    if (travelData) {
      setLoading(false);
    }
  };

  const graphBuilder = useMemo(() => {
    if (!travelData) return;

    const hierarchyData = transformDataForD3(travelData);
    const hierarchy = d3.hierarchy(hierarchyData);

    const treeLayout = d3.tree<TreeNode>().nodeSize([100, 100]);
    const root = treeLayout(hierarchy);

    const flowNodes = root.descendants().map((d) => ({
      id: d.data.id,
      data: { label: d.data.name },
      position: { y: d.y, x: d.x },
      type: "default",
      style: {
        background:
          d.data.type === "location"
            ? "#e8f5e9"
            : d.data.type === "risk"
            ? d.data.severity === 5 || d.data.severity === 4
              ? "#ffcdd2"
              : "#ffebee"
            : d.data.type === "prevention"
            ? "#e0f7fa"
            : "#f6ca9eff",
        border:
          d.data.severity === 5 || d.data.severity === 4
            ? "2px solid red"
            : "1px solid #777",
        maxWidth: 100,
        fontSize: "10px",
        borderRadius: 10,
      },
    }));

    const flowEdges = root.links().map((l) => ({
      id: `e-${l.source.data.id}-${l.target.data.id}`,
      source: l.source.data.id,
      target: l.target.data.id,
      label: l.target.data.label,
      labelStyle: { fill: "#555", fontWeight: 700, fontSize: 10 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.8 },
      type: "bezier",
      animated: true,
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [travelData]);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "white" }}>
      {loading === true && <LoadingComponent />}
      <ReactFlow
        nodes={graphBuilder?.nodes || []}
        edges={graphBuilder?.edges || []}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <Panel position="top-right">{travelData && travelData.id}</Panel>
      </ReactFlow>

      <div style={styles.container}>
        <label style={styles.label}>
          Origin:
          <input
            placeholder="Origin..."
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Destination:
          <input
            style={styles.input}
            placeholder="Destination..."
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </label>
        <button
          style={styles.button}
          onClick={getTravelData}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#1a1a1a")
          }
        >
          Generate Route Graph
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: 320,
    position: "absolute" as const,
    top: 20,
    left: 20,
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
    gap: "12px",
    zIndex: 5,
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    gap: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#f9f9f9",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  button: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};
