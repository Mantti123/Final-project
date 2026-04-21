import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Needed in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully 🚀" });
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Insert failed:", error);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, date, time, created_at FROM reservations ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Reservation query failed:", error);
    res.status(500).json({ error: "Reservation query failed" });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const { name, date, time } = req.body;

    // simple validation (backend-side)
    if (!name || !date || !time) {
      return res.status(400).json({ error: "Missing required fields: name, date, time" });
    }

    const result = await pool.query(
      `INSERT INTO reservations (name, date, time)
       VALUES ($1, $2, $3)
       RETURNING id, name, date, time, created_at`,
      [name, date, time]
    );

    res.status(201).json({ ok: true, reservation: result.rows[0] });
  } catch (error) {
    console.error("Reservation insert failed:", error);
    res.status(500).json({ ok: false, error: "Reservation insert failed" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});