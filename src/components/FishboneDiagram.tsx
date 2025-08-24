import React, { useEffect, useState } from "react";
import Fishbone from "@hophiphip/react-fishbone";
import type { FishboneNode } from "@hophiphip/react-fishbone";
import { type Cause } from "../slices/fishboneSlice";
import type { Diagram } from "../services/api";

import "@hophiphip/react-fishbone/style.css";

function transformCausesToNodes(causes: Cause[]) {
  if (!Array.isArray(causes)) return [];

  return causes.map((cause) => {
    const node: FishboneNode = { label: cause.name };

    if (cause.causes && cause.causes.length > 0) {
      node.children = transformCausesToNodes(cause.causes);
    }

    return node;
  });
}

// Nodes do not handle long text well, so hacking away the overflow styles as a workaround
function nodeHack() {
  const nodes = document.querySelectorAll(".react-flow__node");
  nodes.forEach((node) => {
    removeTextOverflowStyles(node as HTMLElement);
  });
}

function removeTextOverflowStyles(node: HTMLElement) {
  if (!node) return;

  // Remove the styles if they exist
  if (node.style) {
    node.style.overflow = '';
    node.style.whiteSpace = '';
  }

  // Recursively process children
  node.childNodes.forEach(child => removeTextOverflowStyles(child as HTMLElement));
}

interface FishboneDiagramProps {
  diagram: Diagram;
}

const FishboneDiagram: React.FC<FishboneDiagramProps> = ({ diagram }) => {
  const { problem, causes } = diagram;
  const [renderKey, setRenderKey] = useState(0);

  const items: FishboneNode = {
    label: problem,
    children: transformCausesToNodes(causes),
  };

  // Force re-render the entire diagram when it changes to prevent layout issues
  useEffect(() => setRenderKey(prev => prev + 1), [diagram]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Fishbone
        key={renderKey}
        items={items}
        reactFlowProps={{
          onViewportChange: () => {
            nodeHack();
          },
        }}
      />
    </div>
  );
};

export default FishboneDiagram;
