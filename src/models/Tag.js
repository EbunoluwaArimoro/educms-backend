const db = require('../config/database');

const Tag = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM tags ORDER BY name ASC');
    return rows;
  },

  async create(tagData) {
    const { name, slug, description } = tagData;
    const query = `
      INSERT INTO tags (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, slug, description]);
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM tags WHERE tag_id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Tag;