# AImonk - Nested Tags Tree

A premium full-stack application for managing and visualizing recursive nested tag hierarchies. Built with **React**, **FastAPI**, and **SQLite**.

![App Screenshot](frontend/public/logo.png)

## Features

- **Infinite Nesting**: Create deeply nested tag structures with ease.
- **Real-time Editing**: Edit tag names and data inline with immediate feedback.
- **REST Persistence**: Automatically save and load your trees from a persistent backend.
- **JSON Export**: Export your tree structures to standard JSON format.
- **Responsive Design**: Premium UI built with Tailwind CSS and Inter typography.

## Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Axios** (API Client)

### Backend
- **FastAPI** (Python Framework)
- **SQLAlchemy** (ORM)
- **Pydantic** (Validation)
- **SQLite** (Default Database)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+

### Quick Start

1. **Clone the repository**
2. **Backend Setup**
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   python main.py
   ```
3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Project Structure

```
AImonk/
├── backend/            # FastAPI + SQLite Backend
│   ├── main.py         # Application entry point
│   ├── models.py       # Database models
│   └── schemas.py      # Pydantic validation schemas
└── frontend/           # React + Vite Frontend
    ├── src/
    │   ├── App.tsx     # Main application logic
    │   └── components/ # UI Components
    └── public/         # Static assets (logo, favicon)
```

## API Endpoints

- `GET /trees`: Fetch all saved trees.
- `POST /trees`: Create a new tree.
- `PUT /trees/{id}`: Update an existing tree.
- `DELETE /trees/{id}`: Delete a tree.

## Git Workflow
This repository is configured with a root `.gitignore` to exclude environment variables, database files, and node modules. Ensure you create local `.env` files based on the project requirements.
