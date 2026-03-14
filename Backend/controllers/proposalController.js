import { pool } from "../config/db.js";

export const requestProject = async (req, res) => {

  try {

    const { projectCode, message, price } = req.body;
    const freelancerId = req.user.id;

    const project = await pool.query(
      "SELECT id FROM projects WHERE project_code=$1",
      [projectCode]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectId = project.rows[0].id;

    await pool.query(
      `INSERT INTO proposals(project_id,freelancer_id,message,price)
       VALUES($1,$2,$3,$4)`,
      [projectId, freelancerId, message, price]
    );

    res.json({ message: "Request sent to client" });

  } catch (err) {
    res.status(500).json(err);
  }

};

export const getIncomingProposals = async (req, res) => {
  try {
    const clientId = req.user.id;
    const result = await pool.query(
      `SELECT p.id, p.message, p.price, p.status, p.created_at, 
              prj.title as project_title, prj.project_code,
              u.name as freelancer_name, u.email as freelancer_email
       FROM proposals p
       JOIN projects prj ON p.project_id = prj.id
       JOIN users u ON p.freelancer_id = u.id
       WHERE prj.client_id = $1 AND p.status = 'pending'
       ORDER BY p.created_at DESC`,
      [clientId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};