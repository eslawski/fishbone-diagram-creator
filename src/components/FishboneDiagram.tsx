import React from "react";
import { useAppSelector } from "../hooks";
import { type Cause } from "../slices/fishboneSlice";

import Fishbone from '@hophiphip/react-fishbone';
import '@hophiphip/react-fishbone/style.css';

interface FishboneNode {
  label: string;
  children?: FishboneNode[];
}

function transformCausesToNodes(causes: Cause[]) {
  if (!Array.isArray(causes)) return [];

  return causes.map(cause => {
    const node: FishboneNode = { label: cause.name };

    if (cause.causes && cause.causes.length > 0) {
      node.children = transformCausesToNodes(cause.causes);
    }

    return node;
  });
}

const FishboneDiagram: React.FC = () => {
  // The `state` arg is correctly typed as `RootState` already
  const causes = useAppSelector((state) => state.fishbone.causes);
  const problem = useAppSelector((state) => state.fishbone.problem);

  const items: FishboneNode = {
    label: "Problem",
    children: transformCausesToNodes(causes || []),
  }

  return (
    <div style={{width: "100%", height: "100%"}}>
      <Fishbone items={items} reactFlowProps={{
        onNodeMouseEnter: (event, node) => {
          console.log(node);
        }
      }} />
    </div>
  );
};

export default FishboneDiagram;
