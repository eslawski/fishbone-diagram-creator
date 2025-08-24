import React, { useState } from "react";
import { Button, Collapse, Tooltip, Modal } from "antd";
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
  parentCauseId?: string;
}

const CauseCollapse: React.FC<CauseCollapseProps> = ({
  cause,
  parentCauseId,
}) => {
  const { id, name, causes } = cause;
  const [isEditCauseModalOpen, setIsEditCauseModalOpen] = useState(false);
  const [isNewCauseModalOpen, setIsNewCauseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const genExtra = () => (
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
            setIsDeleteModalOpen(true);
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
    extra: genExtra(),
  };

  // To make sections collapsible, change activeKey to defaultActiveKey
  return (
    <div>
      <Collapse
        key={1}
        defaultActiveKey={[1]}
        items={[collapseItem]}
        style={{
          marginBottom: 12,
          backgroundColor: !parentCauseId ? "#CEDAEC" : "#F2F2F2",
        }}
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

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Cause"
        open={isDeleteModalOpen}
        onOk={() => {
          dispatch(deleteCause({ causeId: id }));
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the cause <strong>{name}</strong>?
        </p>
        <p style={{ color: "#ff4d4f" }}>
          This action cannot be undone and{" "}
          <strong>will also delete all sub-causes.</strong>
        </p>
      </Modal>
    </div>
  );
};

export default CauseCollapse;
