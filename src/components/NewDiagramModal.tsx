import React, { useRef, useEffect, useState } from "react";
import { Modal, Input, type InputRef, Form } from "antd";
import { diagramAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

interface NewDiagramModalProps {
  isOpen: boolean;
  userId: string;
  userName: string;
  onCancel: () => void;
}

const NewDiagramModal: React.FC<NewDiagramModalProps> = ({
  isOpen,
  userId,
  userName,
  onCancel,
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

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

  const onFinish = async (values: { problem: string }) => {
    try {
      setCreating(true);
      const response = await diagramAPI.createDiagram(userId, values.problem);
      const newDiagram = response.data;
      
      // Navigate to the new diagram page
      navigate(`/diagram/${newDiagram.id}`);
    } catch (error) {
      console.error('Error creating diagram:', error);
      // You could add error handling here with message.error
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Modal
        title={`Create New Diagram for ${userName}`}
        centered
        open={isOpen}
        onOk={handleOk}
        onCancel={onCancel}
        destroyOnHidden={true}
        confirmLoading={creating}
        okText="Create"
        cancelText="Cancel"
      >
        <div style={{ marginTop: 24 }}></div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="problem"
            label="Problem Statement:"
            rules={[{ required: true, message: "Please enter a problem statement" }]}
          >
            <Input.TextArea 
              ref={inputRef} 
              data-1p-ignore 
              placeholder="Describe the problem you want to analyze..."
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewDiagramModal;
