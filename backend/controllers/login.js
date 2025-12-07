import bcrypt from "bcrypt";
import User from "../models/user.js";

// Iniciar sesión
export const loginUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Validar campos
        if (!correo || !password) {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
        }

        // Buscar usuario por correo
        const usuario = await User.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Si todo es correcto
        res.status(200).json({ message: "Inicio de sesión correcto",
            usuario:{
                id:usuario.userID,
                nombre:usuario.nombre,
                apellido:usuario.apellido,
                edad:usuario.edad,
                correo:usuario.correo,
                telefono:usuario.telefono
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message,
        });
    }
};
