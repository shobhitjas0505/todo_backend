// controllers/todoController.js
// CRUD operations for Todos. All routes expect req.user to be populated
// by the auth middleware (so we know who is making the request).

const Todo = require('../models/Todo');

/**
 * Create a new todo for the authenticated user.
 * Expects: { title, description }
 */
exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    // req.user.id comes from authMiddleware after verifying JWT
    const todo = new Todo({
      userId: req.user.id,
      title,
      description: description || ''
    });

    await todo.save();

    return res.status(201).json({ message: 'Todo created successfully.', todo });
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({ error: 'Server error while creating todo.' });
  }
};

/**
 * Get all todos for the authenticated user.
 */
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({ error: 'Server error while fetching todos.' });
  }
};

/**
 * Update a todo by ID.
 * Rules:
 *  - Only the owner of the todo can update it.
 *  - Only allow updating of specific fields (title, description, completed).
 */
exports.updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const updates = {};

    // Only accept certain fields from the request body
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    // Find todo
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    // Check ownership
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this todo.' });
    }

    // Apply updates
    Object.assign(todo, updates);
    await todo.save();

    return res.json({ message: 'Todo updated successfully.', todo });
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({ error: 'Server error while updating todo.' });
  }
};

/**
 * Delete a todo by ID.
 * Rules:
 *  - Only the owner of the todo can delete it.
 */
exports.deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    // Find todo
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    // Check ownership
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this todo.' });
    }

    await todo.remove();

    return res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({ error: 'Server error while deleting todo.' });
  }
};