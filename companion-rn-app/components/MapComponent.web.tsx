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
  const [travelData, setTravelData] = useState<any>({
    steps: [
      {
        node_from: "Start",
        node_to: "Brent Cross West Stop SF",
        label: "Walk to Brent Cross stop",
        probability: 7,
        risks: [
          {
            failure_mode: "Tripped On Pavement",
            label: "Caught foot on crack",
            severity: 4,
            probability: 5,
          },
          {
            failure_mode: "Too Fatigued To Continue",
            label: "Needed rest mid-walk",
            severity: 3,
            probability: 7,
          },
          {
            failure_mode: "Lost En Route",
            label: "Missed a turn",
            severity: 2,
            probability: 3,
          },
          {
            failure_mode: "Could Not Cross Curb",
            label: "High curb without ramp",
            severity: 3,
            probability: 4,
          },
        ],
        preventions: [
          {
            label: "Announce uneven pavement and curbs",
            adjusted_probabilities: {
              "Brent Cross West Stop SF": 7,
              "Tripped On Pavement": 3,
              "Too Fatigued To Continue": 7,
              "Lost En Route": 2,
              "Could Not Cross Curb": 2,
            },
          },
          {
            label: "Route via dropped kerbs and crossings",
            adjusted_probabilities: {
              "Brent Cross West Stop SF": 7,
              "Tripped On Pavement": 2,
              "Too Fatigued To Continue": 4,
              "Lost En Route": 3,
              "Could Not Cross Curb": 1,
            },
          },
          {
            label: "Suggest benches and rest reminders",
            adjusted_probabilities: {
              "Brent Cross West Stop SF": 7,
              "Tripped On Pavement": 5,
              "Too Fatigued To Continue": 4,
              "Lost En Route": 2,
              "Could Not Cross Curb": 4,
            },
          },
        ],
      },
      {
        node_from: "Brent Cross West Stop SF",
        node_to: "Etheridge Road Stop M",
        label: "Bus 266 to Etheridge Road",
        probability: 7,
        risks: [
          {
            failure_mode: "Missed Bus 266",
            label: "Arrived as doors closed",
            severity: 3,
            probability: 5,
          },
          {
            failure_mode: "Overcrowded Bus 266",
            label: "Too crowded to board",
            severity: 2,
            probability: 4,
          },
          {
            failure_mode: "Bus 266 Broke Down",
            label: "Mechanical issue mid-route",
            severity: 2,
            probability: 1,
          },
          {
            failure_mode: "Missed 266 Stop",
            label: "Did not press bell",
            severity: 2,
            probability: 3,
          },
        ],
        preventions: [
          {
            label: "Remind user to leave earlier for 266",
            adjusted_probabilities: {
              "Etheridge Road Stop M": 7,
              "Missed Bus 266": 3,
              "Overcrowded Bus 266": 3,
              "Bus 266 Broke Down": 1,
              "Missed 266 Stop": 3,
            },
          },
          {
            label: "Show next bus with seating available",
            adjusted_probabilities: {
              "Etheridge Road Stop M": 7,
              "Missed Bus 266": 3,
              "Overcrowded Bus 266": 2,
              "Bus 266 Broke Down": 1,
              "Missed 266 Stop": 3,
            },
          },
          {
            label: "Send bell reminder one stop early",
            adjusted_probabilities: {
              "Etheridge Road Stop M": 7,
              "Missed Bus 266": 5,
              "Overcrowded Bus 266": 4,
              "Bus 266 Broke Down": 1,
              "Missed 266 Stop": 1,
            },
          },
        ],
      },
      {
        node_from: "Etheridge Road Stop M",
        node_to: "Southbourne Crescent Stop TN",
        label: "Bus 112 to Southbourne",
        probability: 7,
        risks: [
          {
            failure_mode: "Missed Bus 112",
            label: "Arrived as doors closed",
            severity: 3,
            probability: 5,
          },
          {
            failure_mode: "Overcrowded Bus 112",
            label: "Too crowded to board",
            severity: 2,
            probability: 4,
          },
          {
            failure_mode: "Bus 112 Broke Down",
            label: "Mechanical issue mid-route",
            severity: 2,
            probability: 1,
          },
          {
            failure_mode: "Missed Southbourne Stop",
            label: "Did not press bell",
            severity: 2,
            probability: 3,
          },
        ],
        preventions: [
          {
            label: "Remind user to leave earlier for 112",
            adjusted_probabilities: {
              "Southbourne Crescent Stop TN": 7,
              "Missed Bus 112": 3,
              "Overcrowded Bus 112": 4,
              "Bus 112 Broke Down": 1,
              "Missed Southbourne Stop": 3,
            },
          },
          {
            label: "Show next 112 with seating available",
            adjusted_probabilities: {
              "Southbourne Crescent Stop TN": 7,
              "Missed Bus 112": 3,
              "Overcrowded Bus 112": 2,
              "Bus 112 Broke Down": 1,
              "Missed Southbourne Stop": 3,
            },
          },
          {
            label: "Send bell reminder one stop early",
            adjusted_probabilities: {
              "Southbourne Crescent Stop TN": 7,
              "Missed Bus 112": 5,
              "Overcrowded Bus 112": 4,
              "Bus 112 Broke Down": 1,
              "Missed Southbourne Stop": 1,
            },
          },
        ],
      },
      {
        node_from: "Southbourne Crescent Stop TN",
        node_to: "Destination",
        label: "Walk to destination",
        probability: 6,
        risks: [
          {
            failure_mode: "Tripped Near Destination",
            label: "Caught foot on curb",
            severity: 4,
            probability: 5,
          },
          {
            failure_mode: "Rest Needed Before Arrival",
            label: "Exhausted after journey",
            severity: 3,
            probability: 7,
          },
          {
            failure_mode: "At Wrong Address",
            label: "Misread door numbers",
            severity: 2,
            probability: 3,
          },
          {
            failure_mode: "Entrance Stairs Barrier",
            label: "No handrail at steps",
            severity: 3,
            probability: 4,
          },
        ],
        preventions: [
          {
            label: "Announce curb and surface hazards ahead",
            adjusted_probabilities: {
              Destination: 6,
              "Tripped Near Destination": 3,
              "Rest Needed Before Arrival": 7,
              "At Wrong Address": 3,
              "Entrance Stairs Barrier": 4,
            },
          },
          {
            label: "Suggest nearby benches before final stretch",
            adjusted_probabilities: {
              Destination: 6,
              "Tripped Near Destination": 4,
              "Rest Needed Before Arrival": 3,
              "At Wrong Address": 3,
              "Entrance Stairs Barrier": 4,
            },
          },
          {
            label: "Highlight step-free entrance and ramps",
            adjusted_probabilities: {
              Destination: 6,
              "Tripped Near Destination": 5,
              "Rest Needed Before Arrival": 7,
              "At Wrong Address": 3,
              "Entrance Stairs Barrier": 0,
            },
          },
        ],
      },
    ],
  });
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

      if (d.data.type === "risk" && d.parent) {
        const stepPreventions = d.parent.data.preventions || [];

        const activePrevention = stepPreventions.find(
          (p: any) => p.label === selectedPrevention
        );

        if (activePrevention) {
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
