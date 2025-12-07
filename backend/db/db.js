import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const uri= process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(()=> console.log("✅ Conectado a la base de datos"))
    .catch(err => console.log("❌error al conectar a la base de datos"));