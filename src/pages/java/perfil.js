document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    // Validaciones iniciales
    if (!contenedor) {
        console.warn("Contenedor user-menu-container no encontrado");
        return;
    }

    if (!sesionActiva) {
        console.log("No hay sesión activa");
        return;
    }

    // Obtener datos del localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));

    if (!perfil || !perfil.correo) {
        console.error("No hay datos de usuario en localStorage");
        return;
    }

    let usuario = null;

    try {
        // Petición al backend
        const res = await fetch("https://ecomercej.onrender.com/api/perfil/obtener", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: perfil.correo })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "No se pudo obtener perfil");
        }

        usuario = data.usuario;
        console.log("✅ Perfil obtenido:", usuario);

    } catch (error) {
        console.error("❌ Error al obtener el perfil:", error);
        // Cerrar sesión fallida
        localStorage.clear();
        alert("Error al cargar perfil. Redirigiendo al login...");
        window.location.href = "../pages/login.html";
        return;
    }

    // Crear el menú de usuario
    contenedor.innerHTML = `
        <div class="relative">
            <button id="user-menu-btn" 
                class="w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform"> 
                <span id="user-avatar"></span>
            </button>

            <div id="user-dropdown"
                class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 
                    transition-all duration-200 ease-out overflow-hidden transform origin-top scale-95 opacity-0">

                <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                    <p class="text-xs text-gray-500" id="user-correo"></p>
                </div>

                <a href="./perfil.html"
                    class="flex items-center px-4 py-3 text-sm text-blue-600 
                        hover:bg-blue-100 hover:text-blue-800 
                        active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

                    Mi Perfil
                </a>

                <button id="logout-btn"
                    class="flex items-center w-full px-4 py-3 text-sm text-red-600
                        hover:bg-red-100 hover:text-red-800 
                        active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    Cerrar sesión
                </button>
            </div>
        </div>
    `;

    // INSERTAR DATOS EN EL MENÚ
    const nombreCompleto = `${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}`.trim();
    document.getElementById("user-name").textContent = nombreCompleto || "Usuario";

    document.getElementById("user-correo").textContent = usuario?.correo || perfil.correo;

    const avatar = `${usuario?.nombre?.[0] ?? ""}${usuario?.apellido?.[0] ?? ""}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar || "U";

    // ANIMACIÓN ABRIR/CERRAR DROPDOWN
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");

            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);

        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");

            setTimeout(() => {
                drop.classList.add("hidden");
            }, 150);
        }
    });

    // BOTÓN CERRAR SESIÓN
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../pages/login.html";
    });

    

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", (e) => {
        const menu = document.getElementById("user-menu-btn");
        const drop = document.getElementById("user-dropdown");
        
        if (menu && drop && !menu.contains(e.target) && !drop.contains(e.target)) {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");
            setTimeout(() => drop.classList.add("hidden"), 150);
        }
    });
});