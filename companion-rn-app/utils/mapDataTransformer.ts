// import { TravelData, TreeNode } from "./types";

// const transformDataForD3 = (data: TravelData): TreeNode => {
//   const buildStepChildren = (stepIndex: number): TreeNode[] => {
//     if (stepIndex >= data.steps.length) return [];

//     const currentStep = data.steps[stepIndex];

//     const riskNodes = currentStep.risks.map((risk) => {
//       const hasPrevention = risk.prevention && risk.prevention.length > 0;
//       const firstPrevention = hasPrevention ? risk.prevention[0] : null;
//       const remainingPreventions = hasPrevention
//         ? risk.prevention.slice(1)
//         : [];

//       const riskNode = {
//         id: `${currentStep.node_to}-${risk.failure_mode}`,
//         name: risk.failure_mode,
//         type: "risk",
//         severity: risk.severity,
//         probability: risk.probability,
//         label: risk.label,
//         // children: [
//         //   {
//         //     id: `${currentStep.node_to}-${risk.failure_mode}-correction`,
//         //     name: risk.best_correction
//         //       ? risk.best_correction
//         //       : risk.correction[0],
//         //     type: "correction",
//         //   },
//         // ],
//       };

//       if (risk.best_prevention) {
//         return {
//           id: `${currentStep.node_to}-${risk.failure_mode}-gatekeeper`,
//           name: risk.best_prevention,
//           type: "prevention",
//           children: [riskNode],
//         };
//       }

//       // If a prevention exists, this node becomes the parent of the Risk Node
//       if (firstPrevention) {
//         return {
//           id: `${currentStep.node_to}-${risk.failure_mode}-gatekeeper`,
//           name: firstPrevention,
//           type: "prevention",
//           children: [riskNode],
//         };
//       }

//       // If no prevention exists, just return the risk node directly
//       return riskNode;
//     });

//     const preventionNodes = currentStep.preventions.map((prevention, index) => {
//       const preventionNode = {
//         id: `${currentStep.node_to}-${index}`,
//         name: prevention,
//         type: "prevention",
//         children: [],
//       };

//       return preventionNode;
//     });

//     const nextLocationNode: TreeNode = {
//       id: currentStep.node_to,
//       name: currentStep.node_to,
//       label: currentStep.label,
//       type: "location",
//       probability: currentStep.probability,
//       children: buildStepChildren(stepIndex + 1),
//     };

//     return [...riskNodes, ...preventionNodes, nextLocationNode];
//   };

//   return {
//     id: data.steps[0].node_from,
//     name: data.steps[0].node_from,
//     type: "location",
//     children: buildStepChildren(0),
//   };
// };

// export default transformDataForD3;

import { TravelData, TreeNode } from "./types";

const transformDataForD3 = (data: TravelData): TreeNode => {
  const buildStepChildren = (stepIndex: number): TreeNode[] => {
    if (stepIndex >= data.steps.length) return [];

    const currentStep = data.steps[stepIndex];

    const riskNodes = currentStep.risks.map((risk) => {
      return {
        id: `${currentStep.node_to}-${risk.failure_mode}`,
        name: risk.failure_mode,
        type: "risk",
        severity: risk.severity,
        probability: risk.probability,
        label: risk.label,
      };
    });

    const preventionNodes = currentStep.preventions.map((prevention, index) => {
      return {
        id: `${currentStep.node_to}-${index}`,
        name: prevention.label,
        type: "prevention",
        children: [],
      };
    });

    const nextLocationNode: TreeNode = {
      id: currentStep.node_to,
      name: currentStep.node_to,
      label: currentStep.label,
      type: "location",
      probability: currentStep.probability,
      preventions: data.steps[stepIndex + 1]?.preventions || [],
      children: buildStepChildren(stepIndex + 1),
    };

    return [...riskNodes, ...preventionNodes, nextLocationNode];
  };

  return {
    id: data.steps[0].node_from,
    name: data.steps[0].node_from,
    type: "location",
    // Pass the FIRST step's preventions to the root node
    preventions: data.steps[0].preventions || [],
    children: buildStepChildren(0),
  };
};

export default transformDataForD3;
