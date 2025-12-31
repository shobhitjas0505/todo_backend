# To-Do Backend (Node.js + Express + MongoDB + JWT)

Simple, beginner-friendly backend for a cloud-synced To-Do application using Node.js, Express, MongoDB (Mongoose), and JWT authentication.

---

## Project Overview

This project provides a RESTful API for a To-Do app where users can register, login, and manage their personal todos. Each user's data is private and protected by JSON Web Tokens (JWT). Passwords are hashed using bcrypt before being saved.

The code is intentionally simple, well-commented, and suitable for learning.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- dotenv (environment variables)

---

## Folder Structure

Use this exact structure (root folder is `backend/`):

backend/
│
├── package.json
├── server.js
├── .env.example
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   └── Todo.js
│
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
│
├── controllers/
│   ├── authController.js
│   └── todoController.js
│
├── middleware/
│   └── authMiddleware.js
│
└── README.md

Quick notes:
- `config/db.js` - connects to MongoDB using Mongoose.
- `models/` - Mongoose schema definitions for `User` and `Todo`.
- `routes/` - Defines API endpoints and ties them to controller functions.
- `controllers/` - Business logic for each endpoint.
- `middleware/authMiddleware.js` - Protects routes by verifying JWT tokens.

---

## Installation

1. Clone the repository and navigate to the `backend` folder:
   - git clone <your-repo-url>
   - cd backend

2. Install dependencies:
   - npm install

3. Create environment file:
   - Copy `.env.example` to `.env` and fill in values.

---

## Environment Variables

Rename `.env.example` to `.env` and set the values:

- `MONGO_URI` - Connection string to your MongoDB database (e.g., `mongodb://localhost:27017/todo_app`)
- `JWT_SECRET` - Secret string used to sign JWT tokens. Use a long random string in production.
- `PORT` - Port for the server (default `5000`)

Example `.env`:
```
MONGO_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=some_very_secret_string
PORT=5000
```

---

## How to Run

- Development (with live reload using nodemon):
  - npm run dev

- Production:
  - npm start

Server starts on the port specified in `.env` or `5000` by default.
Visit `http://localhost:5000/` to see a simple welcome message.

---

## API Documentation

Base URL: `http://localhost:5000/api`

All request and response bodies are JSON.

### Auth APIs

#### Register User
- Endpoint: `POST /api/auth/register`
- Request body:
```json
{
  "name": "John",
  "email": "john@email.com",
  "password": "password123"
}
```
- Response (success): 201 Created
```json
{
  "message": "User registered successfully."
}
```

Notes:
- Password is hashed before saving.
- Email must be unique.

#### Login User
- Endpoint: `POST /api/auth/login`
- Request body:
```json
{
  "email": "john@email.com",
  "password": "password123"
}
```
- Response (success):
```json
{
  "message": "Login successful.",
  "token": "<JWT token here>",
  "user": {
    "id": "userId",
    "name": "John",
    "email": "john@email.com",
    "createdAt": "2025-..."
  }
}
```

Notes:
- Save the `token` in client (e.g., localStorage) and send it in the `Authorization` header for protected routes.

---

### Todo APIs (Protected Routes)

All Todo endpoints require the `Authorization` header:

Authorization: Bearer <token>

Replace `<token>` with the JWT returned from login.

#### Create Todo
- Endpoint: `POST /api/todos`
- Request body:
```json
{
  "title": "Learn Node.js",
  "description": "Practice backend daily"
}
```
- Response (success): 201 Created
```json
{
  "message": "Todo created successfully.",
  "todo": {
    "_id": "todoId",
    "userId": "userId",
    "title": "Learn Node.js",
    "description": "Practice backend daily",
    "completed": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Get All Todos (Logged-in User)
- Endpoint: `GET /api/todos`
- Response (success):
```json
{
  "todos": [
    {
      "_id": "todoId",
      "userId": "userId",
      "title": "Learn Node.js",
      "description": "Practice backend daily",
      "completed": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Update Todo
- Endpoint: `PUT /api/todos/:id`
- Request body (any of these fields):
```json
{
  "title": "Updated title",
  "description": "Optional description",
  "completed": true
}
```
- Response (success):
```json
{
  "message": "Todo updated successfully.",
  "todo": { /* updated todo object */ }
}
```

Rules:
- Only the owner (user who created the todo) can update it.

#### Delete Todo
- Endpoint: `DELETE /api/todos/:id`
- Response (success):
```json
{
  "message": "Todo deleted successfully."
}
```

Rules:
- Only the owner can delete their todo.

---

## Authentication Explanation (Simple)

- When a user logs in, the server checks the email and password.
- If valid, the server generates a JWT token containing the user's id, name, and email.
- The client stores the token (for example, in localStorage) and includes it in future requests:
  - Header: `Authorization: Bearer <token>`
- The server has middleware that checks this token on protected routes. If the token is valid, the server knows which user is making the request and allows actions on that user's data only.

---

## Learning Outcomes

After working with this backend you should understand:
- How to create a REST API using Express.
- How to design basic Mongoose models and interact with MongoDB.
- How to protect APIs using JWT authentication.
- How to hash passwords with bcrypt.
- How to structure a Node.js backend in a clear and maintainable way.

---

## Notes / Next Steps (Suggestions)

- Add request validation with a library like `express-validator` for stronger validation.
- Add rate limiting and more robust error handling for production.
- Add tests (Jest or Mocha) to validate the API behavior.
- Add pagination for GET /api/todos if users have many todos.

---

If you are a beginner, go through the code files and read the inline comments — they explain each step in simple language. Happy learning!