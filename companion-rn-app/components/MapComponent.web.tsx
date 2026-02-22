import React, { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Panel,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import * as d3 from "d3-hierarchy";
import "@xyflow/react/dist/style.css";
import { calculateRouteGraph } from "@/api/fetchAPI";
import transformDataForD3 from "@/utils/mapDataTransformer";
import { TreeNode } from "@/utils/types";
import LoadingComponent from "./LoadingComponent.web";
import NodeModal from "./NodeModal";

const CustomNode = ({ data, isConnectable }: any) => {
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

const getEdgeColor = (probability: number | undefined) => {
  if (!probability) return;
  const colorWave = [
    "#002fffff",
    "#00eeffff",
    "#00ff2aff",
    "#cdcd00ff",
    "#ff0000ff",
  ];

  const clamped = Math.max(
    0,
    Math.min(1, probability < 1 ? probability : probability / 10)
  );

  const index = Math.floor(clamped * (colorWave.length - 1));
  return colorWave[index];
};

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPrevention, setSelectedPrevention] = useState<string | null>(
    null
  );
  const [travelData, setTravelData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>(
    "Hendon Library, London NW4 4BQ"
  );
  const [destination, setDestination] = useState<string>(
    "Brent Cross, London NW4 3AY"
  );
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [model, setModel] = useState<string>("gpt-5");

  const modelOptions = [
    "gpt-5",
    "gpt-5-mini",
    "gpt-5-nano",
    "gpt-5.2",
    "anticip8",
  ];

  const onNodeClick = (_: any, node: any) => {
    if (node.data.type !== "prevention") return;

    const clickedPrevention = node.data.label;

    setSelectedPrevention((prev) =>
      prev === clickedPrevention ? null : clickedPrevention
    );
  };

  const closeModal = () => setSelectedNode(null);

  const getTravelData = async () => {
    if (origin === "" || destination === "") return;
    setLoading(true);
    const data = await calculateRouteGraph({
      origin,
      destination,
      model,
    });
    setTravelData(data);
    if (data) setLoading(false);
  };

  useEffect(() => {
    if (!travelData) return;

    const hierarchyData = transformDataForD3(travelData);
    const hierarchy = d3.hierarchy(hierarchyData);

    const treeLayout = d3.tree<TreeNode>().nodeSize([130, 200]);
    const root = treeLayout(hierarchy);

    const newNodes: any = [];
    const newEdges: any = [];

    root.descendants().forEach((d) => {
      let x = d.x;
      let y = d.y;

      if (d.data.type === "prevention" && d.parent) {
        y = d.parent.y - 120;

        const siblingPreventions =
          d.parent.children?.filter(
            (child: any) => child.data.type === "prevention"
          ) || [];

        const index = siblingPreventions.indexOf(d);
        const total = siblingPreventions.length;

        const spacing = 140;
        const startX = d.parent.x - ((total - 2) * spacing) / 2;

        x = startX + index * spacing;
      }

      if (d.data.type === "risk" && d.parent) {
        const siblingRisks =
          d.parent.children?.filter(
            (child: any) => child.data.type === "risk"
          ) || [];

        const index = siblingRisks.indexOf(d);
        const total = siblingRisks.length;

        const spacing = 180;
        const startX = d.parent.x - ((total + 1) * spacing) / 2;

        x = startX + index * spacing;
        y = d.parent.y + index * 30 + 170;
      }

      let currentProbability = d.data.probability;

      // if (d.data.type === "risk" && d.parent) {
      //   const stepPreventions = d.parent.data.preventions || [];

      //   const activePrevention = stepPreventions.find(
      //     (p: any) => p.label === selectedPrevention
      //   );

      //   if (activePrevention) {
      //     currentProbability =
      //       activePrevention.adjusted_probabilities[d.data.name] ??
      //       currentProbability;
      //   }
      // }
      if ((d.data.type === "risk" || d.data.type === "location") && d.parent) {
        const stepPreventions = d.parent.data.preventions || [];

        const activePrevention = stepPreventions.find(
          (p: any) => p.label === selectedPrevention
        );

        if (activePrevention) {
          // Since d.data.name is the node_to string for locations (e.g. "Brent Cross..."),
          // it will perfectly match the key in your JSON!
          currentProbability =
            activePrevention.adjusted_probabilities[d.data.name] ??
            currentProbability;
        }
      }

      // 2. Add to newNodes
      newNodes.push({
        id: d.data.id,
        type: "custom",
        position: { x, y },
        data: {
          label: d.data.name,
          type: d.data.type,
          severity: d.data.severity,
          probability: currentProbability, // Use the dynamically calculated probability
          style: {
            background:
              d.data.name === "Start" || d.data.name === "Destination"
                ? "#f4f65fff"
                : d.data.type === "location"
                ? "#e8f5e9"
                : d.data.type === "risk"
                ? d.data.severity && d.data.severity >= 4
                  ? "#ffcdd2"
                  : "#ffebee"
                : d.data.type === "prevention"
                ? selectedPrevention === d.data.name
                  ? "#a6abffff"
                  : "#e0f7fa"
                : "#f6ca9eff",
            border:
              d.data.severity && d.data.severity >= 4
                ? "2px solid red"
                : "1px solid #777",
            borderRadius: "10px",
          },
        },
      });

      // 3. Add to newEdges
      if (d.parent) {
        const isPrevention = d.data.type === "prevention";

        newEdges.push({
          id: `e-${d.parent.data.id}-${d.data.id}`,
          source: d.parent.data.id,
          target: d.data.id,
          label: d.data.label,
          sourceHandle: isPrevention ? "source-top" : "source-bottom",
          targetHandle: isPrevention ? "target-bottom" : "target-top",
          type: "straight",
          animated: true,

          style: {
            // Highlight the edge if this specific prevention is selected
            stroke:
              isPrevention && selectedPrevention === d.data.name
                ? "#8b91faff"
                : getEdgeColor(currentProbability),
            strokeWidth: 2,
          },
        });
      }
    });
    setNodes(newNodes);
    setEdges(newEdges);
  }, [travelData, setNodes, setEdges, selectedPrevention]);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "white" }}>
      {loading && <LoadingComponent />}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
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
        <label style={styles.label}>
          Model:
          <select
            style={styles.input}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            name="model"
          >
            {modelOptions.map((model) => (
              <option value={model}>{model}</option>
            ))}
          </select>
        </label>
        <button style={styles.button} onClick={getTravelData}>
          Generate Route Graph
        </button>
      </div>
      {selectedNode && (
        <NodeModal selectedNode={selectedNode} onClose={closeModal} />
      )}
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
    appearance: "none" as const,
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
