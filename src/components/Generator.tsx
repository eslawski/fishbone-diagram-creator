import React, { useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Button } from "antd";

import CauseCollapse from "./CauseCollapse";
import CauseModal from "./CauseModal";

const Generator: React.FC = () => {
  // The `state` arg is correctly typed as `RootState` already
  const causes = useAppSelector((state) => state.fishbone.causes);
  const [isAddCauseCategoryModalOpen, setIsAddCauseCategoryModalOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {causes &&
        causes.map((cause) => <CauseCollapse key={cause.id} cause={cause} />)}
        
      <Button type="primary" onClick={() => setIsAddCauseCategoryModalOpen(true)}>Add Category</Button>

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
