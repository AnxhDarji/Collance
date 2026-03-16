import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { pool } from "../config/db.js";

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Missing Google token" });
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not set");
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }
    const { email, name, sub } = payload;
    if (!email || !sub) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user;

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      const updatedUser = await pool.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             provider = CASE WHEN provider = 'local' THEN provider ELSE 'google' END,
             google_id = COALESCE(google_id, $2)
         WHERE id = $3
         RETURNING id, name, email, role`,
        [name ?? existingUser.name, sub, existingUser.id]
      );
      user = updatedUser.rows[0];
    } else {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const newUser = await pool.query(
        "INSERT INTO users (name, email, password, role, provider, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role",
        [name ?? email.split("@")[0], email, randomPassword, null, "google", sub]
      );
      user = newUser.rows[0];
    }

    const jwtToken = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google login error:", error);

    // Verification failures should be 401; DB/other server errors should be 500.
    const statusCode = error?.name === "OAuth2ClientError" ? 401 : 500;
    res.status(statusCode).json({
      message: statusCode === 401 ? "Invalid Google token" : "Server error",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    const user = newUser.rows[0];

    // Create JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email and role
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = $2",
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials or role" });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
