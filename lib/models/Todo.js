const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  user_id;
  task;
  done;
  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.task = row.task;
    this.done = row.done;
  }

  static async getAll(uid) {
    const { rows } = await pool.query(
      `
    SELECT * FROM todos WHERE user_id=$1`,
      [uid]
    );
    return rows.map((row) => new Todo(row));
  }

  static async add({ user_id, task, done }) {
    const { rows } = await pool.query(
      `
    INSERT INTO todos (user_id, task, done) 
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [user_id, task, done]
    );
    return new Todo(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM todos WHERE id=$1`,
      [id]
    );
    if (!rows[0]) return null;
    return new Todo(rows[0]);
  }

  static async updateById(id, attrs) {
    const todo = await Todo.getById(id);
    if (!todo) return null;
    const { task, done } = { ...todo, ...attrs };
    const { rows } = await pool.query(
      `
    UPDATE todos
    SET task=$2, done=$3
    WHERE id=$1 RETURNING *`,
      [id, task, done]
    );
    return new Todo(rows[0]);
  }
};
