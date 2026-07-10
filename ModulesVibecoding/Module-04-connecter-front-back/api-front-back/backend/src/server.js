import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import projectsRoutes from "./routes/projectsRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", projectsRoutes);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Projects API listening on http://localhost:${port}`);
});
