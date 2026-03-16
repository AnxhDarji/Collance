import { pool } from "../config/db.js";

const getUserWithRole = async (userId) => {
  const result = await pool.query(
    `SELECT id, name, email, role
     FROM users
     WHERE id = $1`,
    [userId],
  );

  return result.rows[0] ?? null;
};

const ensureProfileExists = async (userId, role) => {
  if (role === "freelancer") {
    await pool.query(
      `INSERT INTO freelancer_profiles (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [userId],
    );
  }

  if (role === "client") {
    await pool.query(
      `INSERT INTO client_profiles (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [userId],
    );
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserWithRole(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = user.role;

    if (!["freelancer", "client"].includes(role)) {
      return res.status(400).json({ message: "Unsupported role for profile" });
    }

    await ensureProfileExists(userId, role);

    if (role === "freelancer") {
      const result = await pool.query(
        `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          fp.bio,
          fp.skills,
          fp.portfolio,
          fp.experience,
          fp.hourly_rate
        FROM users u
        LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
        WHERE u.id = $1
        `,
        [userId],
      );
      return res.json(result.rows[0] ?? user);
    }

    if (role === "client") {
      const result = await pool.query(
        `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          cp.company_name,
          cp.industry,
          cp.bio
        FROM users u
        LEFT JOIN client_profiles cp ON cp.user_id = u.id
        WHERE u.id = $1
        `,
        [userId],
      );
      return res.json(result.rows[0] ?? user);
    }

    res.status(400).json({ message: "Unsupported role for profile" });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserWithRole(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = user.role;

    if (!["freelancer", "client"].includes(role)) {
      return res.status(400).json({ message: "Unsupported role for profile" });
    }

    await ensureProfileExists(userId, role);

    if (role === "freelancer") {
      const { bio, skills, portfolio, experience } = req.body;
      const hourly_rate =
        req.body.hourly_rate !== "" && req.body.hourly_rate != null
          ? parseFloat(req.body.hourly_rate)
          : null;

      if (hourly_rate !== null && isNaN(hourly_rate)) {
        return res
          .status(400)
          .json({ message: "Hourly rate must be a valid number" });
      }

      const experienceInt = experience && !isNaN(experience) ? Number(experience) : null;
      const hourlyRateInt = hourly_rate && !isNaN(hourly_rate) ? Number(hourly_rate) : null;

      const result = await pool.query(
        `
      INSERT INTO freelancer_profiles (user_id, bio, skills, portfolio, experience, hourly_rate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE
        SET bio = EXCLUDED.bio,
            skills = EXCLUDED.skills,
            portfolio = EXCLUDED.portfolio,
            experience = EXCLUDED.experience,
            hourly_rate = EXCLUDED.hourly_rate
      RETURNING *
      `,
        [userId, bio, skills, portfolio, experienceInt, hourlyRateInt],
      );

      return res.json(result.rows[0]);
    }

    if (role === "client") {
      const { company_name, industry, bio } = req.body;

      const result = await pool.query(
        `
        INSERT INTO client_profiles (user_id, company_name, industry, bio)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE
          SET company_name = EXCLUDED.company_name,
              industry = EXCLUDED.industry,
              bio = EXCLUDED.bio
        RETURNING *
        `,
        [userId, company_name, industry, bio],
      );

      return res.json(result.rows[0]);
    }

    res.status(400).json({ message: "Unsupported role for profile" });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
