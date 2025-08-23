import React, { useState } from "react";
import { Button, Collapse } from "antd";
import { SisternodeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CauseModal from "./EditCauseModal";
import { type Cause } from "../slices/fishboneSlice";
import NewCauseModal from "./NewCauseModal";


interface CauseCollapseProps {
  cause: Cause;
}

const CauseCollapse: React.FC<CauseCollapseProps> = ({ cause }) => {
  const { id, name, causes } = cause;
  const [isEditCauseModalOpen, setIsEditCauseModalOpen] = useState(false);
  const [isNewCauseModalOpen, setIsNewCauseModalOpen] = useState(false);

  const genExtra = (id: number, name: string) => (
    <div>
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={(event) => {
          setIsEditCauseModalOpen(true);
          event.stopPropagation(); // Stops collapse from being triggered
        }}
      />

      <Button
        type="text"
        size="small"
        icon={<SisternodeOutlined />}
        onClick={(event) => {
          setIsNewCauseModalOpen(true);
          event.stopPropagation(); // Stops collapse from being triggered
        }}
      />

      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={(event) => {
          alert(`Settings clicked for panel: ${id} ${name}`);
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    </div>
  );

  const collapseItem = {
    key: 1, // Ensures all sections are expanded by default
    label: name,
    children: causes?.map((cause) => (
      <CauseCollapse key={cause.id} cause={cause} />
    )),
    showArrow: false,
    extra: genExtra(id, name),
  };

  // To make sections collapsible, change activeKey to defaultActiveKey
  return (
    <div>
      <Collapse
        activeKey={[1]}
        items={[collapseItem]}
        style={{ marginBottom: 12 }}
      />
      
      <CauseModal
        isOpen={isEditCauseModalOpen}
        cause={cause}
        onOk={() => setIsEditCauseModalOpen(false)}
        onCancel={() => setIsEditCauseModalOpen(false)}
      />

      <NewCauseModal
        isOpen={isNewCauseModalOpen}
        parentCauseId={cause.id}
        parentCauseName={cause.name}
        onOk={() => setIsNewCauseModalOpen(false)}
        onCancel={() => setIsNewCauseModalOpen(false)}
      />
    </div>
  );
};

export default CauseCollapse;
