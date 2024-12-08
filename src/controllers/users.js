import { dbQuery, dbRun } from "../database.js";
import isValidId from "./idCheck.js";
import isValidEmail from "./emailCheck.js";
import { response } from "express";

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await dbQuery("SELECT * FROM users");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const valid = isValidId(id);
    console.log(valid);
    if (valid !== true)
      return res.status(valid.status).json({ message: valid.message });

    const [user] = await dbQuery("SELECT * FROM users WHERE id = ?;", [id]);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, className } = req.body;

    if (!firstName || !lastName || !email || !className)
      return res.status(400).json({ message: "All fields are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    const result = await dbRun(
      "INSERT INTO users (firstName, lastName, email, class) VALUES (?, ?, ?, ?);",
      [firstName, lastName, email, className]
    );
    res.status(201).json(result.lastID);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ message: "Email already exists" });
    }
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, className } = req.body;

    const valid = isValidId(id);
    if (valid !== true)
      return res.status(valid.status).json({ message: valid.message });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!firstName || !lastName || !email || !className)
      return res.status(400).json({ message: "All fields are required" });

    const changes = await dbRun(
      "UPDATE users SET firstName = ?, lastName = ?, email = ?, class = ? WHERE id = ?;",
      [firstName, lastName, email, className, id]
    );
    if (changes.changes === 0)
      return res.status(404).json({ message: "User not found" });
    res.status(204);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const valid = isValidId(id);
    if (valid !== true)
      return res.status(valid.status).json({ message: valid.message });

    const user = await dbRun("DELETE FROM users WHERE id = ?;", [id]);

    if (user.changes === 0)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
