// routes/todoRoutes.js
// Todo routes (protected). All routes require a valid JWT token.

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/todos
 * @desc    Create a new todo for the logged-in user
 * @body    { title, description }
 * @access  Private
 */
router.post('/', authMiddleware, todoController.createTodo);

/**
 * @route   GET /api/todos
 * @desc    Get all todos for the logged-in user
 * @access  Private
 */
router.get('/', authMiddleware, todoController.getTodos);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update a todo by id (only owner can update)
 * @body    { title?, description?, completed? }
 * @access  Private
 */
router.put('/:id', authMiddleware, todoController.updateTodo);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete a todo by id (only owner can delete)
 * @access  Private
 */
router.delete('/:id', authMiddleware, todoController.deleteTodo);

module.exports = router;