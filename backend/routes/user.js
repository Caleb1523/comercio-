import express from "express";
import { registrarUser } from "../controllers/user.js";

const router = express.Router();

// Ruta para registrar un usuario
router.post("/register", registrarUser);

export default router;

