// Importamos modelo de la base de datos
import User from "../models/user.js";

// Obtener perfil del usuario
export const obtenerPerfil = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email es requerido" });
        }
        
        // Traer correo del usuario
        const usuario = await User.findOne({ correo: email }).select('-password');
        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        
        res.status(200).json({
            usuario: {
                id: usuario.userID,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                edad: usuario.edad,
                correo: usuario.correo,
                telefono: usuario.telefono
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener perfil del usuario",
            error: error.message
        });
    }
};

// Actualizar perfil del usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const { emailActual, emailNuevo, nombre, apellido, edad, telefono } = req.body;

        // Validaciones
        if (!emailActual) {
            return res.status(400).json({ message: "El correo actual es requerido" });
        }

        if (!emailNuevo) {
            return res.status(400).json({ message: "El nuevo correo es requerido" });
        }

        if (!nombre || !apellido) {
            return res.status(400).json({ message: "El nombre y apellido son obligatorios" });
        }

        if (edad && (isNaN(edad) || edad < 1 || edad > 120)) {
            return res.status(400).json({ message: "La edad debe ser un número válido entre 1 y 120" });
        }

        // Verificar si el nuevo correo ya existe y NO pertenece al usuario actual
        if (emailNuevo !== emailActual) {
            const correoExistente = await User.findOne({ correo: emailNuevo });
            if (correoExistente) {
                return res.status(400).json({ message: "El nuevo correo ya está registrado" });
            }
        }

        // Buscar y actualizar usuario
        const usuario = await User.findOneAndUpdate(
            { correo: emailActual }, // busca por el correo original
            {
                correo: emailNuevo.trim(),             
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                edad: edad ? parseInt(edad) : undefined,
                telefono: telefono ? telefono.trim() : undefined
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Perfil actualizado correctamente",
            usuario: {
                id: usuario.userID,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                edad: usuario.edad,
                correo: usuario.correo,
                telefono: usuario.telefono
            }
        });


    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            message: "Error del servidor al actualizar perfil",
            error: error.message
        });
    }
};
//eliminar perfil
export const eliminarPerfil = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar email presente
        if (!email) {
            return res.status(400).json({ message: "Email es requerido" });
        }

        const usuarioEliminado = await User.findOneAndDelete({ correo: email });

        if (!usuarioEliminado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            usuario: {
                Id: usuarioEliminado._id,
                userID: usuarioEliminado.userID,
                nombre: usuarioEliminado.nombre,
                apellido: usuarioEliminado.apellido,
                edad: usuarioEliminado.edad,
                correo: usuarioEliminado.correo,
                telefono: usuarioEliminado.telefono,
                password: usuarioEliminado.password
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error del servidor al eliminar perfil",
            error: error.message
        });
    }
}
