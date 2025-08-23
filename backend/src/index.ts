import express from 'express';
import cors from 'cors';
import { Database } from './database';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database();

// Routes

// GET /users - Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /user/{user_id}/diagrams - Get all diagrams for a specific user
app.get('/user/:userId/diagrams', async (req, res) => {
  try {
    const { userId } = req.params;
    const diagrams = await db.getUserDiagrams(userId);
    res.json(diagrams);
  } catch (error) {
    console.error('Error fetching user diagrams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /user/{user_id}/diagram/{diagram_id} - Get specific diagram data
app.get('/user/:userId/diagram/:diagramId', async (req, res) => {
  try {
    const { userId, diagramId } = req.params;
    const diagram = await db.getDiagram(userId, diagramId);
    
    if (!diagram) {
      return res.status(404).json({ error: 'Diagram not found' });
    }
    
    // Parse the causes JSON blob
    const diagramData = {
      ...diagram,
      causes: JSON.parse(diagram.causes)
    };
    
    res.json(diagramData);
  } catch (error) {
    console.error('Error fetching diagram:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /user/{user_id}/diagram/{diagram_id} - Update specific diagram data
app.post('/user/:userId/diagram/:diagramId', async (req, res) => {
  try {
    const { userId, diagramId } = req.params;
    const { problem, causes } = req.body;
    
    // Validate required fields
    if (!problem || !causes) {
      return res.status(400).json({ error: 'Problem and causes are required' });
    }
    
    // Check if diagram exists
    const existingDiagram = await db.getDiagram(userId, diagramId);
    if (!existingDiagram) {
      return res.status(404).json({ error: 'Diagram not found' });
    }
    
    // Update the diagram
    const success = await db.updateDiagram(userId, diagramId, problem, causes);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to update diagram' });
    }
    
    // Return the updated diagram
    const updatedDiagram = await db.getDiagram(userId, diagramId);
    const diagramData = {
      ...updatedDiagram,
      causes: JSON.parse(updatedDiagram!.causes)
    };
    
    res.json(diagramData);
  } catch (error) {
    console.error('Error updating diagram:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users: http://localhost:${PORT}/users`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});
