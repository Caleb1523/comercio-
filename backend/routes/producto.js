import express from "express";
import { crearProductos, obtenerProductos } from "../controllers/productos.js";

const router = express.Router();

// Ruta para crear un nuevo producto
router.post("/", crearProductos);

// Ruta para obtener todos los productos
router.get("/", obtenerProductos);

export default router;

