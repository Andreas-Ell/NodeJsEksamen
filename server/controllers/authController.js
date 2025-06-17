export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid mail' });
    }

    const bruger = rows[0];
    const isValid = await bcrypt.compare(password, bruger.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    const token = jwt.sign({ userId: bruger.id, role: bruger.role }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
      message: 'Login succesfuld',
      token,
      userId: bruger.id,
      name: bruger.name 
    });
  } catch (err) {
    res.status(500).json({ error: 'Serverfejl at login' });
  }
}
