import React, { useEffect, useMemo, useState } from "react";
import { ReactFlow, Panel, Background, Controls } from "@xyflow/react";
import * as d3 from "d3-hierarchy";
import "@xyflow/react/dist/style.css";
import { calculateRouteGraph } from "@/api/fetchAPI";

type Risk = {
  failure_mode: string;
  label: string;
  prevention: string[];
  correction: string[];
  severity: number;
};

type Step = {
  node_from: string;
  node_to: string;
  label: string;
  risks: Risk[];
};

type TravelData = {
  steps: Step[];
};

interface TreeNode {
  id: string;
  name: string;
  type: string;
  children?: TreeNode[];
  label?: string;
  severity?: number;
}

// --- DATA TRANSFORMER ---
const transformDataForD3 = (data: TravelData): TreeNode => {
  const buildStepChildren = (stepIndex: number): TreeNode[] => {
    if (stepIndex >= data.steps.length) return [];

    const currentStep = data.steps[stepIndex];

    const riskNodes = currentStep.risks.map((risk) => {
      // 1. Separate the first prevention from the rest
      const hasPrevention = risk.prevention && risk.prevention.length > 0;
      const firstPrevention = hasPrevention ? risk.prevention[0] : null;
      const remainingPreventions = hasPrevention
        ? risk.prevention.slice(1)
        : [];

      const riskNode = {
        id: `${currentStep.node_to}-${risk.failure_mode}`,
        name: risk.failure_mode,
        type: "risk",
        severity: risk.severity,
        label: risk.label,
        children: [
          {
            id: `${currentStep.node_to}-${risk.failure_mode}-correction`,
            name: risk.correction[0],
            type: "correction",
          },
        ],
      };

      // If a prevention exists, this node becomes the parent of the Risk Node
      if (firstPrevention) {
        return {
          id: `${currentStep.node_to}-${risk.failure_mode}-gatekeeper`,
          name: firstPrevention,
          type: "prevention",
          children: [riskNode],
        };
      }

      // If no prevention exists, just return the risk node directly
      return riskNode;
    });

    const nextLocationNode: TreeNode = {
      id: currentStep.node_to,
      name: currentStep.node_to,
      label: currentStep.label,
      type: "location",
      children: buildStepChildren(stepIndex + 1),
    };

    return [...riskNodes, nextLocationNode];
  };

  return {
    id: data.steps[0].node_from,
    name: data.steps[0].node_from,
    type: "location",
    children: buildStepChildren(0),
  };
};

export default function App() {
  const [travelData, setTravelData] = useState(null);
  const origin = "Trolley Park, Brent Cross, London NW2 6GJ";
  const destination = "51.5860469, -0.2071016";

  useEffect(() => {
    const getTravelData = async () => {
      const travelData = await calculateRouteGraph(origin, destination);

      if (!getTravelData) {
        return;
      }

      setTravelData(travelData);
    };
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!travelData) return;

    const hierarchyData = transformDataForD3(travelData);
    const hierarchy = d3.hierarchy(hierarchyData);

    // Increased width (y-axis in D3 terms) to accommodate the extra layer of nodes
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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <Panel position="top-right">Risk Mitigation Tree</Panel>
      </ReactFlow>
    </div>
  );
}
