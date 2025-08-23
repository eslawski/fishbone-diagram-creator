import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Button } from "antd";
import { updateDiagram } from "../slices/fishboneSlice";

import CauseCollapse from "./CauseCollapse";
import CauseModal from "./CauseModal";
import EditableHeading from "./EditableHeading";

const Generator: React.FC = () => {
  // The `state` arg is correctly typed as `RootState` already
  const causes = useAppSelector((state) => state.fishbone.causes);
  const problem = useAppSelector((state) => state.fishbone.problem);
  const dispatch = useAppDispatch();

  const [isAddCauseCategoryModalOpen, setIsAddCauseCategoryModalOpen] =
    useState(false);

  const handleProblemUpdated = (newValue: string) => {
    dispatch(
      updateDiagram({
        userId: "4bcfb57e-7d27-434d-8c6a-5ce86b5d0aa7",
        diagramId: "cd52c7e2-0712-4646-9fbb-f3de4b0cc756",
        problem: newValue,
        causes: causes || [],
      })
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <EditableHeading
        value={problem || "Empty!"}
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
