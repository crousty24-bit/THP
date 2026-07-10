import { Router } from "express";
import { create, index } from "../controllers/projectsController.js";

const router = Router();

router.get("/projects", index);
router.post("/projects", create);

export default router;
