import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, type InputRef } from "antd";
import { addCause } from "../slices/fishboneSlice";
import { useAppDispatch } from "../hooks";

interface NewCauseModalProps {
  parentCauseId: number;
  parentCauseName: string;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const NewCauseModal: React.FC<NewCauseModalProps> = ({
  isOpen,
  parentCauseId,
  parentCauseName,
  onOk,
  onCancel,
}) => {

  const [causeName, setCauseName] = useState("");
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (isOpen) {
      // small timeout ensures modal is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleOk = () => {
    dispatch(addCause({ parentId: parentCauseId, newCauseName: causeName }))
    setCauseName("")
    onOk()
  };

  return (
    <div>
      <Modal
        title={`Cause of "${parentCauseName}"?`}
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

export default NewCauseModal;
