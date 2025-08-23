import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, type InputRef, Form } from "antd";
import { type Cause, updateCause, addCause } from "../slices/fishboneSlice";
import { useAppDispatch } from "../hooks";

interface CauseModalProps {
  isOpen: boolean;
  parentCauseId?: number;
  cause?: Cause;
  onOk: () => void;
  onCancel: () => void;
}

const CauseModal: React.FC<CauseModalProps> = ({
  isOpen,
  cause,
  parentCauseId,
  onOk,
  onCancel,
}) => {
  // const [causeName, setCauseName] = useState(cause.name);
  // const [causeNotes, setCauseNotes] = useState(cause.notes || "");
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      // small timeout ensures modal is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen]);

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values: { name: string; notes: string }) => {
    const isExistingCause = cause !== undefined;
    if (isExistingCause) {
      dispatch(updateCause({ id: cause.id, newName: values.name, newNotes: values.notes }));
    } else {
      if (!parentCauseId) {
        throw new Error("ParentId is required when adding a new cause");
      }
      dispatch(addCause({ parentId: parentCauseId, newCauseName: values.name, notes: values?.notes }));
    }
    onOk();
  };

  // const handleOk = () => {
  //   dispatch(updateCause({ id: cause.id, newName: causeName, newNotes: causeNotes }))
  //   onOk()
  // };

  return (
    <div>
      <Modal
        title="Edit Cause"
        centered
        open={isOpen}
        onOk={handleOk}
        onCancel={onCancel}
        destroyOnHidden={true}
      >
        {/* Name:
        <Input ref={inputRef} value={causeName} autoFocus={true} onChange={(e) => setCauseName(e.target.value)} onPressEnter={handleOk} style={{ marginBottom: 12 }} />

        Notes:
        <Input.TextArea ref={inputRef} value={causeNotes} autoFocus={true} onChange={(e) => setCauseNotes(e.target.value)} onPressEnter={handleOk} /> */}

        <div style={{ marginTop: 24 }}></div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name:"
            initialValue={cause?.name}
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input ref={inputRef} data-1p-ignore />
          </Form.Item>
          <Form.Item name="notes" label="Notes:" initialValue={cause?.notes}>
            <Input.TextArea data-1p-ignore />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauseModal;
