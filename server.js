import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "your_secret_key";

/* ===== SIGNUP ===== */
app.post("/signup", async (req, res) => {
  const { matric, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (matric, password) VALUES ($1, $2)",
      [matric, hashed]
    );
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "User exists or error" });
  }
});

/* ===== LOGIN ===== */
app.post("/login", async (req, res) => {
  const { matric, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE matric=$1",
    [matric]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ error: "User not found" });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user.id }, SECRET);

  res.json({ token });
});

/* ===== DASHBOARD ===== */
app.get("/dashboard", async (req, res) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, SECRET);

    const result = await pool.query(
      "SELECT matric FROM users WHERE id=$1",
      [decoded.id]
    );

    res.json({
      user: result.rows[0],
      mealPlan: "Active",
      wallet: "₦5,000",
      transport: "Available"
    });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));