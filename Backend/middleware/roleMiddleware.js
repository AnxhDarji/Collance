import { pool } from "../config/db.js";

const resolveUserRole = async (req) => {
  if (req.user.role) {
    return req.user.role;
  }

  const result = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
  const role = result.rows[0]?.role;
  req.user.role = role;
  return role;
};

export const allowClient = async (req, res, next) => {
  try {
    const role = await resolveUserRole(req);
    if (role !== "client") {
      return res.status(403).json({ error: "Access denied. Client only." });
    }
    next();
  } catch (err) {
    console.error("Role Middleware Error:", err);
    res.status(500).json(err);
  }
};


export const allowFreelancer = async (req, res, next) => {
  try {
    const role = await resolveUserRole(req);
    if (role !== "freelancer") {
      return res.status(403).json({ error: "Access denied. Freelancer only." });
    }
    next();
  } catch (err) {
    console.error("Role Middleware Error:", err);
    res.status(500).json(err);
  }
};
