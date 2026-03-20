const db = require('../config/database');

const Post = {
  async findAll({ limit, offset }) {
    const query = `
      SELECT p.post_id, p.title, p.slug, p.status, p.created_at, 
             u.username as author, c.name as category
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await db.query(query, [limit, offset]);
    
    const countQuery = 'SELECT COUNT(*) FROM posts';
    const { rows: countRows } = await db.query(countQuery);
    
    return { posts: rows, total: parseInt(countRows[0].count) };
  },

  async findById(id) {
    const query = `
      SELECT p.*, u.username as author, c.name as category
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.post_id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async create(postData) {
    // 1. Added published_at to destructuring
    const { title, slug, content, excerpt, author_id, category_id, status, featured_image, published_at } = postData;
    
    const query = `
      INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, status, featured_image, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    // 2. Added published_at to the values array
    const values = [title, slug, content, excerpt, author_id, category_id, status || 'draft', featured_image, published_at || null];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async update(id, postData) {
    // 1. Added published_at to destructuring
    const { title, content, status, category_id, published_at } = postData;
    
    const query = `
      UPDATE posts 
      SET title = $1, content = $2, status = $3, category_id = $4, published_at = $5, updated_at = CURRENT_TIMESTAMP
      WHERE post_id = $6
      RETURNING *
    `;
    // 2. Added published_at to the values array at index $5
    const { rows } = await db.query(query, [title, content, status, category_id, published_at, id]);
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM posts WHERE post_id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Post;