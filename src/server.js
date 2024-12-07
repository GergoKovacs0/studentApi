import express from "express";
import cors from "cors";
import { initializeDB } from "./database.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "somthign went bad" });
});

const serverStart = async () => {
  try {
    await initializeDB();
    app.listen(PORT, () =>
      console.log(`Server running on port: http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};

serverStart();
