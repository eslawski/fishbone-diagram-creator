import React, { useRef, useEffect } from "react";
import { Modal, Input, type InputRef, Form } from "antd";
import { type Cause, updateCause, addCause, addCauseCategory } from "../slices/fishboneSlice";
import { useAppDispatch } from "../hooks";

interface CauseModalProps {
  isOpen: boolean;
  heading: string;
  parentCauseId?: number; // Undefined when adding a cause category
  cause?: Cause;
  onOk: () => void;
  onCancel: () => void;
}

const CauseModal: React.FC<CauseModalProps> = ({
  isOpen,
  cause,
  parentCauseId,
  heading,
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
      dispatch(updateCause({ causeId: cause.id, causeName: values.name, notes: values.notes }));
    } else {
      if (parentCauseId) {
        dispatch(addCause({ parentId: parentCauseId, causeName: values.name, notes: values?.notes }));
      } else {
        dispatch(addCauseCategory({ categoryName: values.name, notes: values?.notes }));
      }
    }
    onOk();
  };

  return (
    <div>
      <Modal
        title={heading}
        centered
        open={isOpen}
        onOk={handleOk}
        onCancel={onCancel}
        destroyOnHidden={true}
      >
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
