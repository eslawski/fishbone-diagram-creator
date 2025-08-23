import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

interface EditableHeadingProps {
  value: string;
  onSave: (newValue: string) => void;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: React.CSSProperties;
  className?: string;
}

const EditableHeading: React.FC<EditableHeadingProps> = ({
  value,
  onSave,
  level = 1,
  style,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(value);

  // Sync editing value when value changes from external sources
  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditingValue(value);
  };

  const handleSave = () => {
    onSave(editingValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingValue(value);
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {isEditing ? (
        <>
          <Input
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            style={{ 
              fontSize: level === 1 ? "24px" : level === 2 ? "20px" : "16px", 
              fontWeight: "bold", 
              flex: 1,
              ...style
            }}
            onPressEnter={handleSave}
            className={className}
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            size="small"
          />
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            size="small"
          />
        </>
      ) : (
        <>
          <HeadingTag 
            style={{ margin: 0, ...style }} 
            className={className}
          >
            {value}
          </HeadingTag>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={handleEdit}
          />
        </>
      )}
    </div>
  );
};

export default EditableHeading;
