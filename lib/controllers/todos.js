const { Router } = require('express');
const Todo = require('../models/Todo');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      res.json(todos);
    } catch (e) {
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const todo = await Todo.add({ user_id: req.user.id, ...req.body });
      res.json(todo);
    } catch (e) {
      next(e);
    }
  })
  .put('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const todo = await Todo.updateById(req.params.id, req.body);
      res.json(todo);
    } catch (e) {
      next(e);
    }
  });
