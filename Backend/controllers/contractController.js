import { pool } from "../config/db.js";

export const acceptProposal = async (req, res) => {

  try {

    const { proposalId } = req.body;

    const proposal = await pool.query(
      "SELECT * FROM proposals WHERE id=$1",
      [proposalId]
    );

    const data = proposal.rows[0];

    await pool.query(
      "UPDATE proposals SET status='accepted' WHERE id=$1",
      [proposalId]
    );

    await pool.query(
      `INSERT INTO contracts(project_id,client_id,freelancer_id)
       VALUES($1,$2,$3)`,
      [data.project_id, req.user.id, data.freelancer_id]
    );

    res.json({ message: "Freelancer accepted" });

  } catch (err) {
    res.status(500).json(err);
  }

};

export const rejectProposal = async (req, res) => {

  const { proposalId } = req.body;

  await pool.query(
    "UPDATE proposals SET status='rejected' WHERE id=$1",
    [proposalId]
  );

  res.json({ message: "Proposal rejected" });

};

export const getMyContracts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT c.id, c.status, c.created_at,
              p.title as project_title, p.project_code,
              client.name as client_name,
              freelancer.name as freelancer_name
       FROM contracts c
       JOIN projects p ON c.project_id = p.id
       JOIN users client ON c.client_id = client.id
       JOIN users freelancer ON c.freelancer_id = freelancer.id
       WHERE c.client_id = $1 OR c.freelancer_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};