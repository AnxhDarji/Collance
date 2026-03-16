import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";

export const setRole = async (req, res) => {
  const { role } = req.body;
  if (!["client", "freelancer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, req.user.id]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
