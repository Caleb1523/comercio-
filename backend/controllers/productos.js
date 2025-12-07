import productos from "../models/productos.js";

// Crear producto
export const crearProductos = async (req, res) => {
    try {
        const { productID, nombre, descripcion, precio, image } = req.body;

        if (!productID || !nombre || !descripcion || !precio || !image) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const nuevoProducto = new productos({
            productID,
            nombre,
            descripcion,
            precio,
            image,
        });

        await nuevoProducto.save();
        res.status(201).json({ message: "Producto guardado con éxito" });

    } catch (error) {
        res.status(500).json({ message: "Error al guardar el producto", error: error.message });
    }
};

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
    try {
        const lista = await productos.find();
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
};

export default productos;