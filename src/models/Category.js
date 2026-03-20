const db = require('../config/database');

const Category = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY display_order ASC, name ASC');
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM categories WHERE category_id = $1', [id]);
    return rows[0];
  },

  async create(categoryData) {
    const { name, slug, description, parent_id, display_order } = categoryData;
    const query = `
      INSERT INTO categories (name, slug, description, parent_id, display_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, slug, description, parent_id, display_order || 0]);
    return rows[0];
  },

  async update(id, categoryData) {
    const { name, description, parent_id, display_order, is_active } = categoryData;
    const query = `
      UPDATE categories 
      SET name = $1, description = $2, parent_id = $3, display_order = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
      WHERE category_id = $6
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, description, parent_id, display_order, is_active, id]);
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM categories WHERE category_id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Category;