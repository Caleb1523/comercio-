import express from "express";
import { obtenerPerfil, actualizarPerfil,eliminarPerfil } from '../controllers/perfil.js';

const router=express.Router();
//ruta para obtener perfil
router.post('/obtener',obtenerPerfil);
// Ruta para actualizar el perfil
router.put('/actualizar', actualizarPerfil);
//ruta para eliminar
router.delete('/eliminar', eliminarPerfil)

export default router;