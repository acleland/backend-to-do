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
};
