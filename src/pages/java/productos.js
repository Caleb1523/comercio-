// productos.js - Frontend con funcionalidad de carrito

// Crear función de cargar productos
async function cargarProductos() {
    try {
        const response = await fetch('https://ecomercej.onrender.com/api/productos');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const productos = await response.json();

        // Guarda información en la constante
        const grid = document.getElementById('products-grid');

        // Convierte JSON a HTML
        grid.innerHTML = productos.map(producto => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                data-category="${producto.categoria || 'sin-categoria'}"
                data-price="${producto.precio}"
                data-product-id="${producto.productID}">
                
                <div class="relative bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    <img src="${producto.image}" alt="${producto.nombre}"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy">
                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-b-full text-xs font-bold">
                        -15%
                    </div>
                </div>

                <div class="p-6 flex flex-col justify-between h-52">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-1">${producto.nombre}</h3>
                        <p class="text-sm text-gray-600 mb-3">${producto.descripcion}</p>
                    </div>

                    <div class="flex items-center justify-between mb-3">
                        <span class="text-2xl font-bold text-gray-800">
                            $${(producto.precio || 0).toLocaleString('es-CO')}
                        </span>
                        <div class="text-yellow-500">★★★★★</div>
                    </div>

                    <div class="flex space-x-2">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                            Ver detalles
                        </button>
                        <button onclick="agregarAlCarrito('${producto.productID}', '${producto.nombre.replace(/'/g, "\\'")}', ${producto.precio}, '${producto.image}')" 
                                class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                            🛒 Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log("✅ Productos cargados con éxito");
        actualizarContadorCarrito(); // Actualizar contador al cargar productos
        
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        const grid = document.getElementById('products-grid');
        grid.innerHTML = `<p class="text-red-500 text-center mt-4">Error al cargar los productos.</p>`;
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(productID, nombre, precio, imagen) {
    // Obtener carrito actual del localStorage
    let carrito = localStorage.getItem('carrito');
    carrito = carrito ? JSON.parse(carrito) : [];

    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.productID === productID);

    if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        productoExistente.cantidad += 1;
        mostrarNotificacion(`Se agregó otra unidad de ${nombre}`, 'success');
    } else {
        // Si no existe, agregar nuevo producto
        carrito.push({
            productID: productID,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
        mostrarNotificacion(`${nombre} agregado al carrito`, 'success');
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar contador del carrito
    actualizarContadorCarrito();

    // Animación del botón
    animarBotonCarrito();
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = localStorage.getItem('carrito');
    const productos = carrito ? JSON.parse(carrito) : [];
    
    // Calcular total de productos (sumando las cantidades)
    const totalProductos = productos.reduce((sum, item) => sum + item.cantidad, 0);
    
    const contador = document.getElementById('cart-counter');
    if (contador) {
        contador.textContent = totalProductos;
        contador.style.display = totalProductos > 0 ? 'flex' : 'none';
    }
}

// Mostrar notificación cuando se agrega un producto
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 flex items-center gap-3 ${
        tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-semibold`;
    
    notificacion.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => notificacion.remove(), 500);
    }, 3000);
}

// Animación del icono del carrito cuando se agrega un producto
function animarBotonCarrito() {
    const iconoCarrito = document.querySelector('.cart-icon');
    if (iconoCarrito) {
        iconoCarrito.classList.add('scale-125');
        setTimeout(() => {
            iconoCarrito.classList.remove('scale-125');
        }, 300);
    }
}

// Hacer que el icono del carrito redirija a la página del carrito
document.addEventListener('DOMContentLoaded', () => {
    const iconoCarrito = document.querySelector('.cart-icon');
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = './carrito.html';
        });
    }
    
    // Cargar productos al iniciar
    cargarProductos();
});

// Cargar automáticamente cada 5 segundos (opcional, puedes quitarlo si no lo necesitas)
// setInterval(() => {
//     cargarProductos();
// }, 5000);

// ============================================
// FUNCIONALIDAD DE BÚSQUEDA Y FILTROS
// ============================================

// Búsqueda de productos
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', filtrarProductos);
}

// Filtros
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortFilter = document.getElementById('sort-filter');

if (categoryFilter) categoryFilter.addEventListener('change', filtrarProductos);
if (priceFilter) priceFilter.addEventListener('change', filtrarProductos);
if (sortFilter) sortFilter.addEventListener('change', filtrarProductos);

function filtrarProductos() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const category = categoryFilter?.value || '';
    const priceRange = priceFilter?.value || '';
    const sortBy = sortFilter?.value || 'relevance';

    const productos = document.querySelectorAll('.product-card');

    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const productoCategory = producto.dataset.category;
        const precio = parseFloat(producto.dataset.price);

        // Filtro de búsqueda
        const matchSearch = nombre.includes(searchTerm);

        // Filtro de categoría
        const matchCategory = !category || productoCategory === category;

        // Filtro de precio
        let matchPrice = true;
        if (priceRange) {
            if (priceRange === '0-50000') {
                matchPrice = precio <= 50000;
            } else if (priceRange === '50000-150000') {
                matchPrice = precio > 50000 && precio <= 150000;
            } else if (priceRange === '150000-300000') {
                matchPrice = precio > 150000 && precio <= 300000;
            } else if (priceRange === '300000+') {
                matchPrice = precio > 300000;
            }
        }

        // Mostrar u ocultar producto
        if (matchSearch && matchCategory && matchPrice) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });

    // Aplicar ordenamiento
    ordenarProductos(sortBy);
}

function ordenarProductos(criterio) {
    const grid = document.getElementById('products-grid');
    const productos = Array.from(document.querySelectorAll('.product-card'));

    productos.sort((a, b) => {
        const precioA = parseFloat(a.dataset.price);
        const precioB = parseFloat(b.dataset.price);
        const nombreA = a.querySelector('h3').textContent;
        const nombreB = b.querySelector('h3').textContent;

        switch (criterio) {
            case 'price-asc':
                return precioA - precioB;
            case 'price-desc':
                return precioB - precioA;
            case 'name':
                return nombreA.localeCompare(nombreB);
            default:
                return 0;
        }
    });

    // Reordenar en el DOM
    productos.forEach(producto => grid.appendChild(producto));
}