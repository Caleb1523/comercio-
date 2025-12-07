import mongoose from 'mongoose';

const pedidosSchema = new mongoose.Schema({
    productos: [{
        productID: { type: String, required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true, default: 1 },
        imagen: { type: String }
    }],
    
    subtotal: { type: Number, required: true },
    envio: { type: Number, default: 0 }, 
    total: { type: Number, required: true },
    
    estado: { 
        type: String, 
        enum: ['pendiente', 'procesando', 'enviado', 'entregado'], 
        default: 'pendiente'
    },
    
    metodoPago: { 
        type: String, 
        required: true, 
        enum: ['Efectivo contra entrega', 'tarjeta', 'nequi']
    },
    
    direccion: {
        calle: { type: String, required: true },
        ciudad: { type: String, required: true },
        codigoPostal: { type: String, required: true }
    },
    
    fechaPedido: { 
        type: Date, 
        default: Date.now
    }
});

const Pedido = mongoose.model('pedidos', pedidosSchema, 'pedidos');

export default Pedido;