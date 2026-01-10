import { Pool } from 'pg';
const pool = new Pool({
  connectionString: `postgres://${process.env.YANDEX_USER}:${process.env.YANDEX_PASSWORD}@${process.env.YANDEX_HOST}:${process.env.YANDEX_PORT}/${process.env.YANDEX_DB}`,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { telegram_id, subject, score, accuracy_pct } = req.body;
  try {
    const user = await pool.query('SELECT id FROM users WHERE telegram_id = $1', [telegram_id]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    await pool.query(
      'INSERT INTO homework_stats (student_id, subject, score, accuracy_pct) VALUES ($1, $2, $3, $4)',
      [user.rows[0].id, subject, score, accuracy_pct]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}