import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, type InputRef } from "antd";
import { type Cause, updateCauseName } from "../slices/fishboneSlice";
import { useAppDispatch } from "../hooks";

interface CauseModalProps {
  isOpen: boolean;
  cause: Cause;
  onOk: () => void;
  onCancel: () => void;
}

const CauseModal: React.FC<CauseModalProps> = ({
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

  return (
    <div>
      <Modal
        title="Edit Cause"
        centered
        open={isOpen}
        onOk={() => {
          dispatch(updateCauseName({ id: cause.id, name: causeName }))
          onOk()
        }}
        onCancel={onCancel}
      >
        <Input ref={inputRef} value={causeName} autoFocus={true} onChange={(e) => setCauseName(e.target.value)} />
      </Modal>
    </div>
  );
};

export default CauseModal;
