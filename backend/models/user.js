import mongoose from "mongoose";

// Crear modelo de usuarios
const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: Number,
        required: true,
        min: 1000000000, 
        max: 999999999999
    },
    password: {
        type: String,
        required: true
    },
    // ✅ NUEVOS CAMPOS para recuperación de contraseña
    codigoRecuperacion: {
        type: String,
        required: false
    },
    codigoExpiracion: {
        type: Date,
        required: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Crear la constante usuarios
const User = mongoose.model("user", UserSchema, "user");

export default User;


