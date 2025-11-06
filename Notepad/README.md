# Notes Keeper App

A MERN stack note-taking application with user authentication, CRUD operations, search, and pin functionality.

## Features
- 🔐 User authentication (signup/login with JWT)
- ✅ Create, Read, Update, Delete notes
- 🔍 Search notes by title or content
- 📌 Pin important notes (appear first)
- 📦 Archive and trash functionality
- 🎨 Clean Google Keep-inspired UI with dark/light themes

## Setup

### Backend
```bash
cd backend
npm install
# Make sure MongoDB is running
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Tech Stack
- **Backend**: Express.js, MongoDB, Mongoose
- **Frontend**: React, Axios
- **Features**: REST API, Real-time search, State management

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Notes (Protected - requires JWT token)
- `GET /api/notes` - Get all user notes (with optional search query)
- `POST /api/notes` - Create a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete/trash a note

## Environment Variables
Create `.env` in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noteskeeper
JWT_SECRET=your_secret_key_here
```

## Usage
1. Start the backend and frontend servers
2. Open http://localhost:3000
3. Sign up with your name, email, and password
4. Login to access your notes
5. Create, edit, search, pin, archive, and manage your notes
