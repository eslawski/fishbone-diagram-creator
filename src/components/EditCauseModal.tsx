import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, type InputRef } from "antd";
import { type Cause, updateCauseName } from "../slices/fishboneSlice";
import { useAppDispatch } from "../hooks";

interface EditCauseModalProps {
  isOpen: boolean;
  cause: Cause;
  onOk: () => void;
  onCancel: () => void;
}

const EditCauseModal: React.FC<EditCauseModalProps> = ({
  isOpen,
  cause,
  onOk,
  onCancel,
}) => {

  const [causeName, setCauseName] = useState(cause.name);
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isOpen) {
      // small timeout ensures modal is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleOk = () => {
    dispatch(updateCauseName({ id: cause.id, newName: causeName }))
    onOk()
  };

  return (
    <div>
      <Modal
        title="Edit Cause"
        centered
        open={isOpen}
        onOk={handleOk}
        onCancel={onCancel}
      >
        <Input ref={inputRef} value={causeName} autoFocus={true} onChange={(e) => setCauseName(e.target.value)} onPressEnter={handleOk} />
      </Modal>
    </div>
  );
};

export default EditCauseModal;
