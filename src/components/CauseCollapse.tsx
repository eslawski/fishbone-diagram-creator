import React, { useState } from "react";
import { Button, Collapse, Tooltip } from "antd";
import {
  SisternodeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CauseModal from "./CauseModal";
import { deleteCause, type Cause } from "../slices/fishboneSlice";
import { useAppDispatch } from "../hooks";

interface CauseCollapseProps {
  cause: Cause;
  parentCauseId?: number;
}

const CauseCollapse: React.FC<CauseCollapseProps> = ({
  cause,
  parentCauseId,
}) => {
  const { id, name, causes } = cause;
  const [isEditCauseModalOpen, setIsEditCauseModalOpen] = useState(false);
  const [isNewCauseModalOpen, setIsNewCauseModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const genExtra = (id: number) => (
    <div>
      <Tooltip title="Edit cause">
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={(event) => {
            setIsEditCauseModalOpen(true);
            event.stopPropagation(); // Stops collapse from being triggered
          }}
        />
      </Tooltip>

      <Tooltip title="Add sub cause">
        <Button
          type="text"
          size="small"
          icon={<SisternodeOutlined />}
          onClick={(event) => {
            setIsNewCauseModalOpen(true);
            event.stopPropagation(); // Stops collapse from being triggered
          }}
        />
      </Tooltip>

      <Tooltip title="Delete cause">
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={(event) => {
            dispatch(deleteCause({ causeId: id }));
            event.stopPropagation(); // Stops collapse from being triggered
          }}
        />
      </Tooltip>
    </div>
  );

  const children = (
    <div>
      <div
        style={{
          marginBottom: 12,
          fontSize: 12,
          color: "gray",
          fontStyle: "italic",
        }}
      >
        {cause.notes}
      </div>
      {causes?.map((childCause) => (
        <CauseCollapse
          key={childCause.id}
          cause={childCause}
          parentCauseId={id}
        />
      ))}
    </div>
  );

  const shouldExpand = causes?.length > 0 || cause.notes;

  const collapseItem = {
    key: shouldExpand ? 1 : 2, // Ensures all sections are expanded by default
    label: name,
    children: children,
    showArrow: false,
    extra: genExtra(id),
  };

  // To make sections collapsible, change activeKey to defaultActiveKey
  return (
    <div>
      <Collapse
        key={1}
        defaultActiveKey={[1]}
        items={[collapseItem]}
        style={{ marginBottom: 12, backgroundColor: !parentCauseId ? "#B2BEB5" : "#F2F2F2" }}
      />

      <CauseModal
        heading="Edit Cause"
        isOpen={isEditCauseModalOpen}
        cause={cause}
        parentCauseId={parentCauseId}
        onOk={() => setIsEditCauseModalOpen(false)}
        onCancel={() => setIsEditCauseModalOpen(false)}
      />

      <CauseModal
        heading="Add Sub Cause"
        isOpen={isNewCauseModalOpen}
        parentCauseId={cause.id}
        onOk={() => setIsNewCauseModalOpen(false)}
        onCancel={() => setIsNewCauseModalOpen(false)}
      />
    </div>
  );
};

export default CauseCollapse;
