# TaskFlow

A collaborative task management platform for teams to streamline projects, organize workflows, and track progress with real-time filtering and pagination capabilities. Built with React, Express.js, TypeScript, and MongoDB.

## Features

- **Team Management**: Create, read, update, and delete team members
- **Project Management**: Create, read, update, and delete projects with assigned team members
- **Task Management**: Create, read, update, and delete tasks with assigned team members, projects, deadlines, and statuses
- **Filtering and Pagination**: Filter tasks by project, team member, status, search term, and date range
- **Validation and Error Handling**: Server-side validation using Zod and comprehensive error handling
- **Type Safety**: Fully typed application using TypeScript for both frontend and backend

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Zod for validation
- CORS for cross-origin resource sharing

### Frontend
- React
- TypeScript
- React Router for navigation
- Axios for API requests

## Project Structure

```
/
├── backend/               # Express.js backend
│   ├── src/               # Source code
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # API controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Entry point
│   └── package.json       # Dependencies and scripts
│
└── frontend/              # React.js frontend
    ├── public/            # Static files
    ├── src/               # Source code
    │   ├── components/    # React components
    │   │   ├── common/    # Common components
    │   │   ├── auth/      # Authentication components
    │   │   ├── teams/     # Team-related components
    │   │   ├── projects/  # Project-related components
    │   │   └── tasks/     # Task-related components
    │   ├── context/       # React context
    │   ├── App.js         # Main App component
    │   └── index.js       # Entry point
    └── package.json       # Dependencies and scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   NODE_ENV=development
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```
   npm start
   ```
   Or for development with auto-reload:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be accessible at `http://localhost:3000`

## API Endpoints

### Teams
- `GET /api/teams` - Get all team members with pagination
- `GET /api/teams/:id` - Get a single team member
- `POST /api/teams` - Create a new team member
- `PUT /api/teams/:id` - Update a team member
- `DELETE /api/teams/:id` - Delete a team member

### Projects
- `GET /api/projects` - Get all projects with pagination
- `GET /api/projects/:id` - Get a single project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks` - Get all tasks with filtering and pagination
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## License
This project is licensed under the MIT License.
- JWT Authentication

## Screenshots

