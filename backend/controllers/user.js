import User from "../models/user.js";
import bcrypt from "bcrypt";

// Crear usuarios
export const registrarUser = async (req, res) => {
    try {
        const { userID, nombre, apellido, edad, correo, telefono, password } = req.body;

        // Validar campos
        if (!userID || !nombre || !apellido || !edad || !correo || !telefono || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el usuario ya existe
        const existeUser = await User.findOne({ correo });
        if (existeUser) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear el nuevo usuario
        const nuevoUser = new User({
            userID,
            nombre,
            apellido,
            edad,
            correo,
            telefono,
            password: hashedPassword,
        });

        await nuevoUser.save();
        res.status(201).json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};
