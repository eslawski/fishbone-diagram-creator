# Fishbone Diagram Creator - Backend

Express.js backend server with SQLite database for the Fishbone Diagram Creator application.

## Features

- **SQLite Database**: Local database with automatic schema creation
- **User Management**: Store and retrieve user information
- **Diagram Storage**: Store fishbone diagrams with JSON causes data
- **RESTful API**: Clean endpoints for data access
- **Seed Data**: Pre-populated with 5 sample users and sample diagram

## Database Schema

### Users Table
- `id` (TEXT, PRIMARY KEY): UUID for user identification
- `name` (TEXT): User's display name

### Diagrams Table
- `id` (TEXT, PRIMARY KEY): UUID for diagram identification
- `user_id` (TEXT, FOREIGN KEY): Reference to users table
- `problem` (TEXT): The main problem statement
- `causes` (TEXT): JSON blob containing the causes structure

## API Endpoints

### GET `/users`
Returns a list of all users in the system.

**Response:**
```json
[
  {
    "id": "uuid-here",
    "name": "Alice Johnson"
  }
]
```

### GET `/user/{user_id}/diagrams`
Returns all diagrams for a specific user.

**Response:**
```json
[
  {
    "id": "diagram-uuid",
    "user_id": "user-uuid",
    "problem": "Problem statement",
    "causes": "JSON string"
  }
]
```

### GET `/user/{user_id}/diagram/{diagram_id}`
Returns a specific diagram with parsed causes data.

**Response:**
```json
{
  "id": "diagram-uuid",
  "user_id": "user-uuid",
  "problem": "Problem statement",
  "causes": {
    "id": 1,
    "name": "Cause Category",
    "causes": [...]
  }
}
```

### GET `/health`
Health check endpoint for monitoring.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development mode:**
   ```bash
   npm run dev
   ```

3. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Development

- **Port**: 3001 (configurable via PORT environment variable)
- **Database**: SQLite file stored in `db/fishbone.db`
- **Hot Reload**: Uses nodemon for development

## Seed Data

The database automatically creates:
- 5 sample users (Alice, Bob, Carol, David, Eva)
- 1 sample diagram for the first user with realistic fishbone data

## Database Location

The SQLite database file is created at: `backend/db/fishbone.db`
