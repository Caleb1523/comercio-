// carrito.js - Controlador del carrito de compras

const API_URL = 'https://ecomercej.onrender.com/api';

// Cargar carrito al inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    actualizarContadorCarrito();
});

// Obtener productos del localStorage
function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contador = document.getElementById('cart-counter');
    const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (contador) {
        contador.textContent = totalProductos;
        contador.style.display = totalProductos > 0 ? 'flex' : 'none';
    }
}

// Mostrar mensaje de carrito vacío
function mostrarCarritoVacio() {
    const container = document.getElementById('productos-container');
    
    if (!container) return;

    container.innerHTML = `
        <div class="col-span-2 text-center py-16">
            <div class="bg-white rounded-2xl shadow-xl p-12">
                <svg class="w-32 h-32 mx-auto text-gray-300 mb-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
                <h2 class="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                <p class="text-gray-600 text-lg mb-8">¡Descubre productos increíbles y comienza tu compra!</p>
                <a href="./productos.html" class="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    Explorar Productos
                </a>
            </div>
        </div>
    `;
}

// Renderizar productos del carrito
function cargarCarrito() {
    const carrito = obtenerCarrito();
    const container = document.getElementById('productos-container');
    
    if (!container) return;
    
    if (carrito.length === 0) {
        mostrarCarritoVacio();
        actualizarResumen(0, 0, 0);
        return;
    }

    const productosHTML = `
        ${carrito.map(producto => `
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-3 shadow-md p-6 flex gap-4 hover:shadow-lg transition-shadow duration-300" data-id="${producto.productID}">
                <img src="${producto.imagen || 'https://via.placeholder.com/150'}" 
                    alt="${producto.nombre}" 
                    class="w-24 h-24 object-cover rounded-lg">
                
                <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-800">${producto.nombre}</h3>
                    <p class="text-blue-600 font-semibold text-xl mt-2">$${producto.precio.toLocaleString()}</p>
                    
                    <div class="flex items-center gap-3 mt-4">
                        <button onclick="cambiarCantidad('${producto.productID}', -1)" 
                                class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold w-8 h-8 rounded-lg transition-colors">
                            -
                        </button>
                        <span class="font-semibold text-lg w-12 text-center">${producto.cantidad}</span>
                        <button onclick="cambiarCantidad('${producto.productID}', 1)" 
                                class="bg-linear-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold w-8 h-8 rounded-lg transition-colors">
                            +
                        </button>
                        <button onclick="eliminarProducto('${producto.productID}')" 
                                class="ml-auto rounded-2xl text-red-500 hover:text-white hover:bg-red-500 hover:rounded-2xl hover:font-normal hover: px-3 hover: py-1 font-semibold transition-colors">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
        
        <button onclick="vaciarCarrito()" 
                class="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-4">
            Vaciar Carrito
        </button>
    `;

    container.innerHTML = productosHTML;
    calcularTotales();
}

// Cambiar cantidad de un producto
function cambiarCantidad(productID, cambio) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(p => p.productID === productID);
    
    if (producto) {
        producto.cantidad += cambio;
        
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.productID !== productID);
        }
        
        guardarCarrito(carrito);
        cargarCarrito();
    }
}

// Eliminar producto del carrito
function eliminarProducto(productID) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(p => p.productID !== productID);
    guardarCarrito(carrito);
    cargarCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
        cargarCarrito();
    }
}

// Calcular totales
function calcularTotales() {
    const carrito = obtenerCarrito();
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 100000 ? 0 : 5000;
    const total = subtotal + envio;
    
    actualizarResumen(subtotal, envio, total);
}

// Actualizar resumen del pedido
function actualizarResumen(subtotal, envio, total) {
    const subtotalEl = document.getElementById('subtotal-display');
    const envioEl = document.getElementById('envio-display');
    const totalEl = document.getElementById('total-display');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
    
    if (envioEl) {
        if (envio === 0) {
            envioEl.textContent = 'Gratis';
            envioEl.className = 'text-green-600 font-semibold';
        } else {
            envioEl.textContent = `$${envio.toLocaleString()}`;
            envioEl.className = 'text-gray-700';
        }
    }
}

// Finalizar compra y enviar al backend
async function finalizarCompra() {
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Obtener datos del formulario
    const direccionCalle = document.getElementById('direccion-calle')?.value.trim();
    const direccionCiudad = document.getElementById('direccion-ciudad')?.value.trim();
    const direccionCodigo = document.getElementById('direccion-codigo')?.value.trim();
    const metodoPagoSelect = document.getElementById('metodo-pago');
    const metodoPago = metodoPagoSelect?.value;

    // Validaciones
    if (!direccionCalle || !direccionCiudad || !direccionCodigo) {
        alert('Por favor completa todos los campos de dirección');
        return;
    }

    if (!metodoPago) {
        alert('Por favor selecciona un método de pago');
        return;
    }

    // Calcular totales
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 100000 ? 0 : 5000;
    const total = subtotal + envio;

    // Preparar datos para enviar
    const pedidoData = {
        productos: carrito.map(p => ({
            productID: p.productID,
            nombre: p.nombre,
            precio: p.precio,
            cantidad: p.cantidad,
            imagen: p.imagen || ''
        })),
        subtotal: subtotal,
        envio: envio,
        total: total,
        metodoPago: metodoPago,
        direccion: {
            calle: direccionCalle,
            ciudad: direccionCiudad,
            codigoPostal: direccionCodigo
        }
    };

    console.log('📦 Enviando pedido:', pedidoData);

    const btnFinalizar = document.getElementById('enviar-code');
    
    if (btnFinalizar) {
        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = `
            <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
        `;
    }

    try {
        const response = await fetch(`${API_URL}/pedido/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });

        const data = await response.json();
        
        console.log(' Respuesta del servidor:', data);

        if (response.ok && data.success) {
            alert('¡Pedido realizado con éxito! Gracias por tu compra.');
            localStorage.removeItem('carrito');
            actualizarContadorCarrito();
            window.location.href = './productos.html';
        } else {
            alert(`Error: ${data.message || 'No se pudo procesar el pedido'}`);
            console.error('Error del servidor:', data);
        }
    } catch (error) {
        console.error(' Error al crear pedido:', error);
        alert('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
        if (btnFinalizar) {
            btnFinalizar.disabled = false;
            btnFinalizar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Finalizar Compra
            `;
        }
    }
}

// Vincular botón de finalizar compra
document.addEventListener('DOMContentLoaded', () => {
    const btnFinalizar = document.getElementById('enviar-code');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
});