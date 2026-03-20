const db = require('../config/database');

const User = {
  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query('SELECT user_id, username, email, first_name, last_name, role, bio, avatar, created_at, last_login, is_active FROM users WHERE user_id = $1', [id]);
    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query('SELECT user_id, username, email, first_name, last_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },

  async create(userData) {
    const { username, email, password_hash, first_name, last_name, role } = userData;
    const query = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, username, email, role, first_name, last_name
    `;
    const values = [username, email, password_hash, first_name, last_name, role || 'subscriber'];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async update(id, userData) {
    const { first_name, last_name, bio, is_active, role } = userData;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, bio = $3, is_active = $4, role = $5, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6
      RETURNING user_id, username, email, first_name, last_name, role, bio, is_active
    `;
    const { rows } = await db.query(query, [first_name, last_name, bio, is_active, role, id]);
    return rows[0];
  },

  async updateLastLogin(userId) {
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [userId]);
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM users WHERE user_id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = User;