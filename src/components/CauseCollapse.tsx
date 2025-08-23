import React, { useState } from "react";
import { Button, Collapse } from "antd";
import { SisternodeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CauseModal from "./CauseModal";
import { type Cause } from "../slices/fishboneSlice";


interface CauseCollapseProps {
  cause: Cause;
}

const CauseCollapse: React.FC<CauseCollapseProps> = ({ cause }) => {
  const { id, name, causes } = cause;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const genExtra = (id: number, name: string) => (
    <div>
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={(event) => {
          setIsModalOpen(true);
          event.stopPropagation();
        }}
      />

      <Button
        type="text"
        size="small"
        icon={<SisternodeOutlined />}
        onClick={(event) => {
          alert(`Settings clicked for panel: ${id} ${name}`);
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
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
        isOpen={isModalOpen}
        cause={cause}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CauseCollapse;
