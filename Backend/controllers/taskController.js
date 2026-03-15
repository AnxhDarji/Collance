import { pool } from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const { projectId, projectCode, taskName, freelancerId } = req.body;
    const clientId = req.user.id;

    const result = await pool.query(
      `INSERT INTO tasks (project_id, project_code, task_name, assigned_by, assigned_to)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [projectId, projectCode, taskName, clientId, freelancerId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};


export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT t.*, u1.name AS client_name, u2.name AS freelancer_name
       FROM tasks t
       JOIN users u1 ON t.assigned_by = u1.id
       JOIN users u2 ON t.assigned_to = u2.id
       WHERE t.project_id = $1
       ORDER BY t.created_at DESC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get Project Tasks Error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, comment } = req.body;
    const freelancerId = req.user.id;

    // Validate status value
    const validStatuses = ["not_started", "in_progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Block updates on already-completed tasks
    const existing = await pool.query(
      `SELECT status FROM tasks WHERE id = $1 AND assigned_to = $2`,
      [taskId, freelancerId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (existing.rows[0].status === "completed") {
      return res.status(403).json({ error: "Completed tasks cannot be modified" });
    }

    const result = await pool.query(
      `UPDATE tasks SET status=$1, comment=$2
       WHERE id=$3 AND assigned_to=$4
       RETURNING *`,
      [status, comment, taskId, freelancerId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};


export const getProjectFreelancers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.name
       FROM contracts c
       JOIN users u ON c.freelancer_id = u.id
       WHERE c.project_id = $1`,
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get Project Freelancers Error:", err);
    res.status(500).json({ error: "Failed to fetch freelancers" });
  }
};


export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT t.*, u1.name AS client_name, u2.name AS freelancer_name
       FROM tasks t
       JOIN users u1 ON t.assigned_by = u1.id
       JOIN users u2 ON t.assigned_to = u2.id
       WHERE t.assigned_to = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get My Tasks Error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
