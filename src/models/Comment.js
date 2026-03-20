const db = require('../config/database');

const Comment = {
  async findByPost(postId) {
    const query = `
      SELECT c.*, u.username, u.avatar 
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = $1 AND c.status = 'approved'
      ORDER BY c.created_at DESC
    `;
    const { rows } = await db.query(query, [postId]);
    return rows;
  },

  async create(commentData) {
    const { post_id, user_id, parent_id, content } = commentData;
    const query = `
      INSERT INTO comments (post_id, user_id, parent_id, content, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    // Default to 'pending' if it's a standard user, or logic can be added to auto-approve admins
    const { rows } = await db.query(query, [post_id, user_id, parent_id, content, 'pending']);
    return rows[0];
  },

  async updateStatus(id, status) {
    const query = `
      UPDATE comments 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE comment_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM comments WHERE comment_id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Comment;