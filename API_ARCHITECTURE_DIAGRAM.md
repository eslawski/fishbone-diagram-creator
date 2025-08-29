# Fishbone Diagram Creator - API Architecture

## System Overview
This diagram shows the relationship between backend API endpoints and frontend components in the Fishbone Diagram Creator application.

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        subgraph "Pages"
            HP[HomePage]
            DP[DiagramPage]
            BTP[BackendTestPage]
        end
        
        subgraph "Components"
            FD[FishboneDiagram]
            GEN[Generator]
            NDM[NewDiagramModal]
            CCM[CauseCollapse]
            CM[CauseModal]
            EH[EditableHeading]
        end
        
        subgraph "State Management"
            RS[Redux Store]
            FS[FishboneSlice]
        end
        
        subgraph "API Layer"
            API[api.ts]
            UAPI[userAPI]
            DAPI[diagramAPI]
        end
    end
    
    subgraph "Backend (Node.js + Express)"
        subgraph "Routes"
            R1["GET /users"]
            R2["POST /user/:userId/diagram"]
            R3["GET /user/:userId/diagrams"]
            R4["GET /user/:userId/diagram/:diagramId"]
            R5["POST /user/:userId/diagram/:diagramId"]
            R6["GET /diagram/:diagramId"]
            R7["POST /diagram/:diagramId"]
            R8["DELETE /diagram/:diagramId"]
            R9["GET /health"]
        end
        
        subgraph "Database Layer"
            DB[(SQLite Database)]
            USERS[users table]
            DIAGRAMS[diagrams table]
        end
    end
    
    %% Frontend to API connections
    HP --> UAPI
    HP --> DAPI
    DP --> DAPI
    BTP --> UAPI
    BTP --> DAPI
    NDM --> DAPI
    
    %% API to Backend connections
    UAPI --> R1
    DAPI --> R2
    DAPI --> R3
    DAPI --> R4
    DAPI --> R5
    DAPI --> R6
    DAPI --> R7
    DAPI --> R8
    DAPI --> R9
    
    %% Backend to Database connections
    R1 --> USERS
    R2 --> DIAGRAMS
    R3 --> DIAGRAMS
    R4 --> DIAGRAMS
    R5 --> DIAGRAMS
    R6 --> DIAGRAMS
    R7 --> DIAGRAMS
    R8 --> DIAGRAMS
    
    %% State management connections
    FS --> DAPI
    RS --> FS
    
    %% Component to state connections
    FD --> RS
    GEN --> RS
    DP --> RS
    
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    
    class HP,DP,BTP,FD,GEN,NDM,CCM,CM,EH,RS,FS,API,UAPI,DAPI frontend
    class R1,R2,R3,R4,R5,R6,R7,R8,R9 backend
    class DB,USERS,DIAGRAMS database
```

## API Endpoint Details

### User Management
| Endpoint | Method | Purpose | Frontend Usage |
|----------|--------|---------|----------------|
| `/users` | GET | Retrieve all users | HomePage, BackendTestPage |

### Diagram Management
| Endpoint | Method | Purpose | Frontend Usage |
|----------|--------|---------|----------------|
| `/user/:userId/diagram` | POST | Create new diagram | NewDiagramModal |
| `/user/:userId/diagrams` | GET | Get all diagrams for a user | HomePage, BackendTestPage |
| `/user/:userId/diagram/:diagramId` | GET | Get specific diagram by user and ID | BackendTestPage |
| `/user/:userId/diagram/:diagramId` | POST | Update diagram by user and ID | Not directly used |
| `/diagram/:diagramId` | GET | Get diagram by ID only | DiagramPage, FishboneSlice |
| `/diagram/:diagramId` | POST | Update diagram by ID only | FishboneSlice (all mutations) |
| `/diagram/:diagramId` | DELETE | Delete diagram by ID | HomePage |

### System
| Endpoint | Method | Purpose | Frontend Usage |
|----------|--------|---------|----------------|
| `/health` | GET | Health check | Available in API service |

## Data Flow

### 1. Diagram Creation Flow
```
NewDiagramModal → diagramAPI.createDiagram() → POST /user/:userId/diagram → Database → Navigate to new diagram
```

### 2. Diagram Loading Flow
```
DiagramPage → Redux fetchDiagram → diagramAPI.getById() → GET /diagram/:diagramId → Database → Update Redux state → Render FishboneDiagram
```

### 3. Diagram Update Flow
```
Generator Component → Redux action (addCause/updateCause/etc.) → diagramAPI.updateDiagram() → POST /diagram/:diagramId → Database → Update Redux state → Re-render components
```

### 4. Home Page Flow
```
HomePage → userAPI.getAll() → GET /users → For each user: diagramAPI.getByUserId() → GET /user/:userId/diagrams → Display all diagrams
```

## Key Frontend Components and Their API Usage

- **HomePage**: Lists all users and their diagrams, handles diagram deletion
- **DiagramPage**: Loads and displays a specific diagram for editing
- **NewDiagramModal**: Creates new diagrams
- **Generator**: Provides editing interface, triggers Redux actions for diagram updates
- **FishboneDiagram**: Renders the visual diagram, receives data from Redux store

## State Management Pattern

The application uses Redux Toolkit with async thunks:
- All diagram mutations go through Redux actions
- Actions call the API and update the store
- Components subscribe to store changes
- Optimistic updates are handled in the Redux slice

## Database Schema

- **users**: id, name
- **diagrams**: id, user_id, problem, causes (JSON string)

The causes field stores a hierarchical structure of causes and sub-causes as a JSON string, which is parsed on the frontend for display and editing.
