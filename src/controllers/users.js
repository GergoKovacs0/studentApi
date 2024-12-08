import { dbQuery, dbRun } from "../database.js";
import checkIfIdValid from "./idCheck.js";
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

    const valid = checkIfIdValid(id);
    if (!valid)
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
    res.status(201).json(response);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "Email already exists" });
    }
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, className } = req.body;

    const valid = checkIfIdValid(id);
    if (!valid)
      return res.status(valid.status).json({ message: valid.message });

    if (!firstName || !lastName || !email || !className)
      return res.status(400).json({ message: "All fields are required" });

    const user = await dbQuery("SELECT * FROM users WHERE id = ?;", [id]);
    if (!user) return res.status(404).json({ message: "User not found" });

    await dbRun(
      "UPDATE users SET firstName = ?, lastName = ?, email = ?, class = ? WHERE id = ?;",
      [firstName, lastName, email, className, id]
    );
    res.status(204).json({ message: "User updated" });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const valid = checkIfIdValid(id);
    if (!valid)
      return res.status(valid.status).json({ message: valid.message });

    const user = await dbQuery("DELETE FROM users WHERE id = ?;", [id]);

    res.status(204).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
