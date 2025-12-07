import Pedido from "../models/pedidos.js";

export const crearPedido = async (req, res) => {
    try {
        const { productos, subtotal, envio, total, metodoPago, direccion } = req.body;

        console.log("📦 Datos recibidos:", req.body);

        // Validaciones
        if (!productos || productos.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Debe incluir al menos un producto" 
            });
        }

        if (!metodoPago || !direccion) {
            return res.status(400).json({ 
                success: false,
                message: "Faltan datos obligatorios (metodoPago o dirección)" 
            });
        }

        if (!direccion.calle || !direccion.ciudad || !direccion.codigoPostal) {
            return res.status(400).json({ 
                success: false,
                message: "La dirección está incompleta" 
            });
        }

        // Validar método de pago - coincide exactamente con el frontend
        const metodosValidos = ['Efectivo contra entrega', 'tarjeta', 'nequi'];
        if (!metodosValidos.includes(metodoPago)) {
            return res.status(400).json({ 
                success: false,
                message: `Método de pago inválido: "${metodoPago}". Opciones válidas: ${metodosValidos.join(', ')}` 
            });
        }

        const nuevoPedido = new Pedido({
            productos,
            subtotal,
            envio: envio || 0,
            total,
            metodoPago,
            direccion,
        });

        await nuevoPedido.save();
        
        console.log("Pedido guardado:", nuevoPedido._id);
        
        res.status(201).json({ 
            success: true,
            message: "Pedido guardado con éxito",
            pedido: nuevoPedido 
        });

    } catch (error) {
        console.error("Error al guardar pedido:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al guardar pedido",
            error: error.message
        });        
    }
};