import express from "express";
import cors from "cors";
import { initializeDB } from "./database.js";
import userRoutes from "./routes/users.js";

import { setupSwagger } from "./swagger.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/api/users", userRoutes);

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
