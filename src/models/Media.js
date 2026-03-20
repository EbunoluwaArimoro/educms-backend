const db = require('../config/database');

const Media = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM media ORDER BY created_at DESC');
    return rows;
  },

  async create(mediaData) {
    const { filename, original_name, file_path, file_type, file_size, mime_type, uploaded_by } = mediaData;
    const query = `
      INSERT INTO media (filename, original_name, file_path, file_type, file_size, mime_type, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [filename, original_name, file_path, file_type, file_size, mime_type, uploaded_by];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM media WHERE media_id = $1', [id]);
    return rows[0];
  },

  async delete(id) {
    const { rowCount } = await db.query('DELETE FROM media WHERE media_id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Media;