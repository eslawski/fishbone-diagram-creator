# Fishbone Diagram Creator

This is a React-based application for creating fishbone diagrams (also known as Ishikawa diagrams or cause-and-effect diagrams) with a full-stack architecture including user and diagram management.

## Features

- **Integrated User & Diagram Management**: Manage users and diagrams directly within the main interface
- **Inline Diagram Operations**: Create, rename, and delete diagrams without leaving the main view
- **Dynamic Sidebar Navigation**: Add new diagrams via user dropdown menus
- **SQLite Database**: Persistent storage for users and diagrams
- **Express Backend**: RESTful API for data operations
- **React Frontend**: Modern UI with Ant Design components

## Project Structure

```
fishbone-diagram-creator/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── AppLayout.tsx   # Main layout with sidebar navigation
│   │   └── DiagramView.tsx # Integrated diagram view with inline editing
│   ├── services/           # API services
│   │   └── api.ts         # Backend communication
│   └── ...
├── server/                 # Backend Express server
│   ├── server.js          # Main server file
│   ├── init-db.js         # Database initialization
│   └── package.json       # Backend dependencies
└── setup-backend.sh       # Backend setup script
```

## Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup Backend

```bash
# Run the setup script (macOS/Linux)
./setup-backend.sh

# Or manually:
cd server
npm install
npm run init-db
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The backend will start on http://localhost:3001

### 4. Start the Frontend

```bash
npm run dev
```

The frontend will start on http://localhost:5173

## Workflow

### Creating New Diagrams
1. **Via Sidebar**: Click on any user's dropdown in the sidebar
2. **Add Diagram Option**: Select the "+ Add Diagram" option (appears first in each user's menu)
3. **Enter Name**: Type the diagram name in the main content area
4. **Create**: Click "Create Diagram" or press Enter

### Managing Existing Diagrams
- **Rename**: Click the "Rename" button next to the diagram title
- **Delete**: Click the "Delete" button (with confirmation dialog)
- **View Details**: See owner, creation date, and content in the main view

### Navigation
- **User Dropdowns**: Expand to see all diagrams for that user
- **Diagram Selection**: Click any diagram to view and edit it
- **Breadcrumb Navigation**: URL updates automatically when switching between diagrams

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Diagrams
- `GET /api/diagrams` - Get all diagrams
- `GET /api/diagrams/:id` - Get diagram by ID
- `GET /api/users/:userId/diagrams` - Get diagrams by user
- `POST /api/diagrams` - Create new diagram
- `PUT /api/diagrams/:id` - Update diagram
- `DELETE /api/diagrams/:id` - Delete diagram

## Database Schema

### Users Table
- `id` (TEXT, PRIMARY KEY): Unique user identifier (UUID)
- `name` (TEXT): User's full name
- `email` (TEXT, UNIQUE): User's email address
- `created_at` (DATETIME): User creation timestamp

### Diagrams Table
- `id` (INTEGER, PRIMARY KEY): Auto-incrementing diagram ID
- `name` (TEXT): Diagram name
- `user_id` (TEXT): Foreign key to users table
- `content` (TEXT): JSON string containing diagram data
- `created_at` (DATETIME): Diagram creation timestamp
- `updated_at` (DATETIME): Last update timestamp

## Sample Data

The database includes sample users and diagrams to get you started:

- **John Doe**: Product Quality Analysis, Customer Service Issues, Manufacturing Process
- **Jane Smith**: Marketing Strategy, Sales Performance
- **Mike Johnson**: IT Infrastructure, Security Assessment, System Architecture

## Development

### Frontend
- React 19 with TypeScript
- Ant Design for UI components
- React Router for navigation
- Axios for API communication

### Backend
- Express.js web framework
- SQLite3 database
- CORS enabled for cross-origin requests
- UUID generation for unique identifiers

## Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run init-db` - Initialize database with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
