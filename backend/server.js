import express from 'express';
import cors from 'cors';
import "./db/db.js";
import productosroute from "./routes/producto.js";
import Userroute from './routes/user.js';
import loginRoutes from './routes/login.js'; 
import perfilRouter from'./routes/perfil.js';
import recuperarPassword from './routes/recuperar.js'
import pedidosRoute from './routes/pedido.js'

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send('Bienvenido al curso de node express');
});

app.use("/api/productos", productosroute);
app.use("/api/user", Userroute);
app.use("/api/login", loginRoutes);
app.use("/api/perfil",perfilRouter)
app.use("/api/recuperar", recuperarPassword)
app.use("/api/pedido", pedidosRoute)

app.listen(8081, () => console.log('Servidor corriendo en http://localhost:8081'));
