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
        node_to: "Hendon Town Hall Stop O",
        label: "Walk to Hendon Town Hall",
        probability: 0.23192412973106843,
        risks: [
          {
            failure_mode: "Overexertion",
            label: "No rest breaks taken",
            severity: 0,
            probability: 0.3612340196861751,
          },
          {
            failure_mode: "Paced Too Fast",
            label: "Walk speed above tolerance",
            severity: 0,
            probability: 0.3126672717874177,
          },
          {
            failure_mode: "Stair Fall",
            label: "Attempted stairs with cane",
            severity: 0,
            probability: 0.23192412973106843,
          },
          {
            failure_mode: "Took Taxi",
            label: "Skipped walking; took taxi",
            severity: 0,
            probability: 0.04902798913059953,
          },
        ],
        preventions: [
          {
            label: "Schedule micro-break reminders en route",
            adjusted_probabilities: {
              Overexertion: 0.2768275251697194,
              "Stair Fall": 0.2224371654923462,
              "Hendon Town Hall Stop O": 0.11906203495714826,
              "Paced Too Fast": 0.01913501034369505,
              "Took Taxi": 0.0014871063123501468,
            },
          },
          {
            label: "Use pace-controlled voice guidance",
            adjusted_probabilities: {
              Overexertion: 0.507738995336578,
              "Hendon Town Hall Stop O": 0.181039903307718,
              "Paced Too Fast": 0.1754698910522241,
              "Stair Fall": 0.12442678457674884,
              "Took Taxi": 0.0009500104500933835,
            },
          },
          {
            label: "Auto-reroute from stairs to ramp",
            adjusted_probabilities: {
              "Stair Fall": 0.37111055720073066,
              "Hendon Town Hall Stop O": 0.22508993108528214,
              Overexertion: 0.18954472567369324,
              "Paced Too Fast": 0.01416642738786465,
              "Took Taxi": 0.0014471916666879117,
            },
          },
        ],
      },
      {
        node_from: "Hendon Town Hall Stop O",
        node_to: "Hendon The Quadrant Stop S",
        label: "Bus 143 towards Archway",
        probability: 0.08867572885476568,
        risks: [
          {
            failure_mode: "Sudden fatigue",
            label: "Felt tired; took rest stop",
            severity: 0,
            probability: 0.6808131927869799,
          },
          {
            failure_mode: "Icy sidewalk detour",
            label: "Slippery path; took detour",
            severity: 0,
            probability: 0.13204263183517653,
          },
          {
            failure_mode: "Sudden crowd rush",
            label: "Felt rush; slowed for balance",
            severity: 0,
            probability: 0.09453581255179402,
          },
          {
            failure_mode: "Urgent restroom need",
            label: "Needed toilet; short detour",
            severity: 0,
            probability: 0.08867572885476568,
          },
        ],
        preventions: [
          {
            label: "Prompt to request priority seat on boarding",
            adjusted_probabilities: {
              "Sudden fatigue": 0.055646546331604554,
              "Hendon The Quadrant Stop S": 0.03884755013617872,
              "Icy sidewalk detour": 0.004496929258520812,
              "Sudden crowd rush": 0.002261198035085713,
              "Urgent restroom need": 0.0006580461435426548,
            },
          },
          {
            label: "Notify crowding; suggest next less-crowded bus",
            adjusted_probabilities: {
              "Hendon The Quadrant Stop S": 0.009530123431305215,
              "Sudden fatigue": 0.001138210929348997,
              "Sudden crowd rush": 0.0011205646045047023,
              "Icy sidewalk detour": 0.00044572980427809574,
              "Urgent restroom need": 0.0003581537887223813,
            },
          },
          {
            label: "Show nearest restroom before boarding",
            adjusted_probabilities: {
              "Urgent restroom need": 0.8384287067051246,
              "Hendon The Quadrant Stop S": 0.03150920144222632,
              "Sudden fatigue": 0.013134989351663434,
              "Icy sidewalk detour": 0.005475478189590121,
              "Sudden crowd rush": 0.0014737049622744632,
            },
          },
        ],
      },
      {
        node_from: "Hendon The Quadrant Stop S",
        node_to: "Destination",
        label: "Walk to destination",
        probability: 0.13873312624901266,
        risks: [
          {
            failure_mode: "Low-light anxiety",
            label: "Poorly lit area on route",
            severity: 0,
            probability: 0.40140940540132275,
          },
          {
            failure_mode: "Slip on ice",
            label: "Icy patches on walkway",
            severity: 0,
            probability: 0.16076485823454462,
          },
          {
            failure_mode: "Fall on stairs",
            label: "No support on stairs",
            severity: 0,
            probability: 0.15137154804902483,
          },
          {
            failure_mode: "Walking fatigue",
            label: "Too tired to continue",
            severity: 0,
            probability: 0.1477210620660951,
          },
        ],
        preventions: [
          {
            label: "Switch to well-lit route automatically",
            adjusted_probabilities: {
              "Low-light anxiety": 0.36445813132833216,
              "Walking fatigue": 0.3266981574837898,
              Destination: 0.10120636790243712,
              "Fall on stairs": 0.039632983126116565,
              "Slip on ice": 0.018431044433928557,
            },
          },
          {
            label: "Announce slippery areas; suggest gritted detours",
            adjusted_probabilities: {
              "Walking fatigue": 0.06229070917891739,
              "Slip on ice": 0.05245403615528367,
              Destination: 0.034400196766449266,
              "Fall on stairs": 0.00911514688581598,
              "Low-light anxiety": 0.0082994356850364,
            },
          },
          {
            label: "Auto-reroute to ramp or lift",
            adjusted_probabilities: {
              "Walking fatigue": 0.6053699206541391,
              Destination: 0.09139718783122378,
              "Fall on stairs": 0.08585971215306847,
              "Low-light anxiety": 0.07577093003188787,
              "Slip on ice": 0.022397844135444316,
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
