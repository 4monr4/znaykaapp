import { Pool } from 'pg';
const pool = new Pool({
  connectionString: `postgres://${process.env.YANDEX_USER}:${process.env.YANDEX_PASSWORD}@${process.env.YANDEX_HOST}:${process.env.YANDEX_PORT}/${process.env.YANDEX_DB}`,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { telegramId } = req.query;
  try {
    const result = await pool.query('SELECT id, role, full_name FROM users WHERE telegram_id = $1', [telegramId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}