import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, Alert, Modal, message } from "antd";
import { Link } from "react-router-dom";
import {
  userAPI,
  diagramAPI,
  type User,
  type Diagram,
  type Cause,
} from "../../services/api";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface UserWithDiagrams {
  user: User;
  diagrams: (Diagram & { causes: Cause[] })[];
}

const HomePage: React.FC = () => {
  const [usersWithDiagrams, setUsersWithDiagrams] = useState<
    UserWithDiagrams[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [diagramToDelete, setDiagramToDelete] = useState<{ id: string; problem: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsersAndDiagrams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all users
        const usersResponse = await userAPI.getAll();
        const users = usersResponse.data;

        // Fetch diagrams for each user
        const usersWithDiagramsData: UserWithDiagrams[] = [];

        for (const user of users) {
          try {
            const diagramsResponse = await diagramAPI.getByUserId(user.id);
            const diagrams = diagramsResponse.data.map((diagram) => ({
              ...diagram,
              causes:
                typeof diagram.causes === "string"
                  ? JSON.parse(diagram.causes)
                  : diagram.causes,
            }));

            usersWithDiagramsData.push({
              user,
              diagrams,
            });
          } catch (diagramError) {
            console.error(
              `Error fetching diagrams for user ${user.id}:`,
              diagramError
            );
            // Continue with other users even if one fails
            usersWithDiagramsData.push({
              user,
              diagrams: [],
            });
          }
        }

        setUsersWithDiagrams(usersWithDiagramsData);
      } catch (err) {
        console.error("Error fetching users and diagrams:", err);
        setError("Failed to load diagrams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndDiagrams();
  }, []);

  const handleDeleteClick = (diagram: { id: string; problem: string }) => {
    setDiagramToDelete(diagram);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!diagramToDelete) return;

    try {
      setDeleting(true);
      await diagramAPI.deleteDiagram(diagramToDelete.id);
      
      // Remove the deleted diagram from state
      setUsersWithDiagrams(prev => 
        prev.map(userSection => ({
          ...userSection,
          diagrams: userSection.diagrams.filter(d => d.id !== diagramToDelete.id)
        }))
      );
      
      message.success('Diagram deleted successfully');
      setDeleteModalVisible(false);
      setDiagramToDelete(null);
    } catch (error) {
      console.error('Error deleting diagram:', error);
      message.error('Failed to delete diagram. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDiagramToDelete(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>
          <Text>Loading diagrams...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={1} style={{ textAlign: "center", marginBottom: "40px" }}>
        Fishbone Diagram Creator
      </Title>

      <Text
        style={{
          fontSize: "16px",
          textAlign: "center",
          display: "block",
          marginBottom: "32px",
        }}
      >
        Explore and analyze cause-and-effect relationships across different
        domains
      </Text>

      {usersWithDiagrams.map(({ user, diagrams }) => (
        <div key={user.id} style={{ marginBottom: "48px" }}>
          <Title level={4}>{user.name}'s Diagrams</Title>

          {diagrams.length === 0 ? (
            <Card>
              <Text type="secondary">No diagrams created yet.</Text>
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {diagrams.map((diagram) => (
                <Col xs={24} sm={12} md={8} lg={6} key={diagram.id}>
                  <Card
                    style={{ height: "100%" }}
                    actions={[
                      <Link to={`/diagram/${diagram.id}`}>
                        <EditOutlined key="edit" />
                      </Link>,
                      <DeleteOutlined key="delete" onClick={() => handleDeleteClick(diagram)} />,
                    ]}
                  >
                    <div>
                      <Title style={{ marginBottom: "12px", fontSize: "16px" }}>
                        {diagram.problem}
                      </Title>
                      <Text type="secondary">
                        {diagram.causes.length} cause categories
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Diagram"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmLoading={deleting}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the diagram <strong>{diagramToDelete?.problem}</strong>?
        </p>
        <p style={{ color: '#ff4d4f' }}>
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default HomePage;
