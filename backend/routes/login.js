import express from "express";
import { loginUsuario } from "../controllers/login.js";

const router=express.Router();
//la ruta
router.post("/",loginUsuario);

export default router;