export const allowClient = (req, res, next) => {
  try {

    if (req.user.role !== "client") {
      return res.status(403).json({ error: "Access denied. Client only." });
    }

    next();

  } catch (err) {
    console.error("Role Middleware Error:", err);
    res.status(500).json(err);
  }
};


export const allowFreelancer = (req, res, next) => {
  try {

    if (req.user.role !== "freelancer") {
      return res.status(403).json({ error: "Access denied. Freelancer only." });
    }

    next();

  } catch (err) {
    console.error("Role Middleware Error:", err);
    res.status(500).json(err);
  }
};