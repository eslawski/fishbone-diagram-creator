import React, { useEffect } from "react";
import { useAppSelector } from "../hooks";
import { type Cause } from "../slices/fishboneSlice";

import Fishbone from "@hophiphip/react-fishbone";
import "@hophiphip/react-fishbone/style.css";

interface FishboneNode {
  label: string;
  children?: FishboneNode[];
}

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

// Root node does not handle long text well, so hacking away the overflow styles as a workaround
function rootNodeHack(problem: string) {
  setTimeout(() => {
    const span = Array.from(document.querySelectorAll("span")).find((el) => el?.textContent?.includes(problem));
    const parent = span?.closest(".react-flow__node");
    removeTextOverflowStyles(parent as HTMLElement);
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

const FishboneDiagram: React.FC = () => {
  // The `state` arg is correctly typed as `RootState` already
  const causes = useAppSelector((state) => state.fishbone.causes);
  const problem = useAppSelector((state) => state.fishbone.problem);

  const items: FishboneNode = {
    label: problem,
    children: transformCausesToNodes(causes || []),
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Fishbone
        items={items}
        reactFlowProps={{
          onViewportChange: () => {
            rootNodeHack(problem);
          },
        }}
      />
    </div>
  );
};

export default FishboneDiagram;
