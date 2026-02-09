import { TravelData, TreeNode } from "./types";

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

export default transformDataForD3;
