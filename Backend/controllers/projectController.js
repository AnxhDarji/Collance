import { pool } from "../config/db.js";
import { generateProjectCode } from "../utils/generateProjectCode.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const clientId = req.user.id;
    const clientName = req.user.name;

    const projectCode = generateProjectCode(clientName);

    const result = await pool.query(
      `INSERT INTO projects(project_code,title,description,budget,client_id)
       VALUES($1,$2,$3,$4,$5)
       RETURNING *`,
      [projectCode, title, description, budget, clientId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json(err);
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const clientId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC",
      [clientId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get My Projects Error:", err);
    res.status(500).json(err);
  }
};