import { pool } from "../config/db.js";

export const createTaskModel = async (
  projectId,
  projectCode,
  taskName,
  clientId,
  freelancerId
) => {

  const result = await pool.query(
    `INSERT INTO tasks
    (project_id, project_code, task_name, assigned_by, assigned_to)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [projectId, projectCode, taskName, clientId, freelancerId]
  );

  return result.rows[0];
};


export const getProjectTasksModel = async (projectId) => {

  const result = await pool.query(
    `SELECT t.*,
    u1.name as client_name,
    u2.name as freelancer_name
    FROM tasks t
    JOIN users u1 ON t.assigned_by = u1.id
    JOIN users u2 ON t.assigned_to = u2.id
    WHERE project_id = $1
    ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};


export const updateTaskStatusModel = async (
  status,
  comment,
  taskId,
  freelancerId
) => {

  const result = await pool.query(
    `UPDATE tasks
    SET status=$1, comment=$2
    WHERE id=$3 AND assigned_to=$4
    RETURNING *`,
    [status, comment, taskId, freelancerId]
  );

  return result.rows[0];
};


export const getMyTasksModel = async (userId) => {

  const result = await pool.query(
    `SELECT *
    FROM tasks
    WHERE assigned_to=$1
    ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};