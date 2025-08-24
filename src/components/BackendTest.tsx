import React, { useState, useEffect } from 'react';
import { Button, List, Card, Typography, Spin, Alert } from 'antd';
import { userAPI, diagramAPI, type User, type Diagram } from '../services/api';

const { Title, Text } = Typography;

const BackendTest: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDiagrams, setUserDiagrams] = useState<Diagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDiagrams = async (user: User) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedUser(user);
      const response = await diagramAPI.getByUserId(user.id);
      setUserDiagrams(response.data);
      setSelectedDiagram(null);
    } catch (err) {
      setError('Failed to load user diagrams');
      console.error('Error loading user diagrams:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDiagram = async (diagram: Diagram) => {
    try {
      setLoading(true);
      setError(null);
      const response = await diagramAPI.getByUserIdAndId(diagram.user_id, diagram.id);
      setSelectedDiagram(response.data);
    } catch (err) {
      setError('Failed to load diagram');
      console.error('Error loading diagram:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Backend Integration Test</Title>
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Users List */}
        <Card title="Users" style={{ flex: 1 }}>
          <List
            dataSource={users}
            renderItem={(user) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <Text strong>{user.name}</Text>
                  <br />
                  <Text code style={{ fontSize: '12px' }}>{user.id}</Text>
                  <br />
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => loadUserDiagrams(user)}
                    style={{ marginTop: '8px' }}
                  >
                    View Diagrams
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* User Diagrams */}
        {selectedUser && (
          <Card title={`${selectedUser.name}'s Diagrams`} style={{ flex: 1 }}>
            {userDiagrams.length === 0 ? (
              <Text type="secondary">No diagrams found for this user.</Text>
            ) : (
              <List
                dataSource={userDiagrams}
                renderItem={(diagram) => (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <Text strong>{diagram.problem}</Text>
                      <br />
                      <Text code style={{ fontSize: '12px' }}>{diagram.id}</Text>
                      <br />
                      <Button 
                        type="default" 
                        size="small" 
                        onClick={() => loadDiagram(diagram)}
                        style={{ marginTop: '8px' }}
                      >
                        View Details
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        )}

        {/* Diagram Details */}
        {selectedDiagram && (
          <Card title="Diagram Details" style={{ flex: 1 }}>
            <div>
              <Text strong>Problem:</Text>
              <br />
              <Text>{selectedDiagram.problem}</Text>
              <br /><br />
              <Text strong>Causes:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {JSON.stringify(selectedDiagram.causes, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={loadUsers} type="primary">
          Refresh Users
        </Button>
      </div>
    </div>
  );
};

export default BackendTest;
