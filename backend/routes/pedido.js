import express from "express";
import { crearPedido } from "../controllers/pedido.js";

const router = express.Router();

router.post("/crear", crearPedido);

export default router;