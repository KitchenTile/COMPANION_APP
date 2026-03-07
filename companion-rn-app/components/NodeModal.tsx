import { ConvertedTreeNode, TreeNode } from "@/utils/types";
import { transform } from "@babel/core";
import React from "react";

type NodeModalProps = {
  selectedNode: ConvertedTreeNode;
  onClose: () => void;
};

const NodeModal = ({ selectedNode, onClose }: NodeModalProps) => {
  console.log(selectedNode.data.label);
  return (
    <div style={styles.modalContainer}>
      <div style={styles.closeX} onClick={onClose}>
        <div
          style={{
            position: "absolute",
            height: 20,
            width: 2,
            backgroundColor: "black",
            borderRadius: 2,
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            height: 20,
            width: 2,
            backgroundColor: "black",
            borderRadius: 2,
            transform: "rotate(135deg)",
          }}
        />
      </div>

      <h2 style={styles.modalTitle}>Node Info:</h2>
      <div style={styles.nodeInfoContainer}>
        <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            legend:
          </p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            {selectedNode.data.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;

const styles = {
  modalContainer: {
    width: 320,
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #343434ff",
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
    gap: "12px",
    zIndex: 5,
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  nodeInfoContainer: {
    margin: "0, auto",
    borderRadius: "12px",
    backgroundColor: "rgb(249, 249, 249)",
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
    gap: "12px",
    zIndex: 5,
  },
  closeX: {
    position: "absolute" as const,
    top: 10,
    right: 5,
    cursor: "pointer",
    fontFamily: "Inter, system-ui, sans-serif",
    height: 20,
    width: 20,
    zIndex: 2,
  },
};

//   return (
//     <div style={{ width: "100%", height: "100vh", backgroundColor: "white" }}>
//       {loading === true && <LoadingComponent />}
//       <ReactFlow
//         nodes={graphBuilder?.nodes || []}
//         edges={graphBuilder?.edges || []}
//         nodesDraggable={true}
//         elementsSelectable={true}
//         onNodeClick={onNodeClick}
//         fitView
//         attributionPosition="bottom-right"
//       >
//         <Background />
//         <Controls />
//         <Panel position="top-right">{travelData && travelData.id}</Panel>
//       </ReactFlow>
//       <div style={styles.container}>
//         <label style={styles.label}>
//           Origin:
//           <input
//             placeholder="Origin..."
//             type="text"
//             value={origin}
//             onChange={(e) => setOrigin(e.target.value)}
//             style={styles.input}
//           />
//         </label>
//         <label style={styles.label}>
//           Destination:
//           <input
//             style={styles.input}
//             placeholder="Destination..."
//             type="text"
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//           />
//         </label>
//         <label style={styles.label}>
//           Model:
//           <select
//             style={styles.input}
//             value={model}
//             onChange={(e) => setModel(e.target.value)}
//             name="model"
//           >
//             {modelOptions.map((model) => (
//               <option value={model}>{model}</option>
//             ))}
//           </select>
//         </label>
//         <button
//           style={styles.button}
//           onClick={getTravelData}
//           onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
//           onMouseOut={(e) =>
//             (e.currentTarget.style.backgroundColor = "#1a1a1a")
//           }
//         >
//           Generate Route Graph
//         </button>
//       </div>
//       {selectedNode && (
//         <NodeModal selectedNode={selectedNode} onClose={closeModal} />
//       )}
//     </div>
//   );
