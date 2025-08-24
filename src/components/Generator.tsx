import React, { useState } from "react";
import { useAppDispatch } from "../hooks";
import { Button } from "antd";
import { updateProblem } from "../slices/fishboneSlice";

import CauseCollapse from "./CauseCollapse";
import CauseModal from "./CauseModal";
import EditableHeading from "./EditableHeading";
import type { Diagram } from "../services/api";

interface GeneratorProps {
  diagram: Diagram;
}

const Generator: React.FC<GeneratorProps> = ({ diagram }) => {
  const { problem, causes } = diagram;
  const dispatch = useAppDispatch();

  const [isAddCauseCategoryModalOpen, setIsAddCauseCategoryModalOpen] =
    useState(false);

  const handleProblemUpdated = (newValue: string) => {
    console.log("handleProblemUpdated", newValue);
    dispatch(
      updateProblem({problem: newValue})
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <EditableHeading
        value={problem}
        onSave={handleProblemUpdated}
        level={1}
      />
      {causes &&
        causes.map((cause) => <CauseCollapse key={cause.id} cause={cause} />)}

      <Button
        type="primary"
        onClick={() => setIsAddCauseCategoryModalOpen(true)}
      >
        Add Category
      </Button>

      <CauseModal
        heading="Add category"
        isOpen={isAddCauseCategoryModalOpen}
        onOk={() => setIsAddCauseCategoryModalOpen(false)}
        onCancel={() => setIsAddCauseCategoryModalOpen(false)}
      />
    </div>
  );
};

export default Generator;
