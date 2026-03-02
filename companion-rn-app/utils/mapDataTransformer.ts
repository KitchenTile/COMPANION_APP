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
