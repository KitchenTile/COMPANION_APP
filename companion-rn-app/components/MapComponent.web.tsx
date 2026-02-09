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
  const [origin, setOrigin] = useState(
    "Trolley Park, Brent Cross, London NW2 6GJ"
  );
  const [destination, setDestination] = useState("51.5860469, -0.2071016");

  const getTravelData = async () => {
    if (origin == "" || destination == "") return;
    setLoading(true);
    const travelData = await calculateRouteGraph(origin, destination);
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

      <div
        style={{
          width: 300,
          height: 100,
          position: "absolute",
          top: 10,
          left: 10,
          borderRadius: 10,
          backgroundColor: "#fff",
          borderStyle: "solid",
          borderWidth: 2,
          display: "flex",
          flexDirection: "column",
          padding: 10,
        }}
      >
        <input
          placeholder="Origin..."
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          placeholder="Destination..."
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={getTravelData}>Generate Route Graph</button>
      </div>
    </div>
  );
}

const styles = {};
