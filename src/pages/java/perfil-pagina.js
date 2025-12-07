//Este código se creo para poder traer los datos de la base de datos en el perfil
//no sabía como integrarlo y si alguien lo ve , que te valga vrga , lo importaqnte es que funcione
document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    
    // Si no hay sesión, redirigir al login
    if (!sesionActiva) {
        window.location.href = './login.html';
        return;
    }

    // Obtener datos del usuario desde la base
    const perfil = JSON.parse(localStorage.getItem("usuario"));

    if (!perfil || !perfil.correo) {
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    let usuario = null;

    try {
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

        // Mostrar datos en la página del perfil 
        const nombreCompleto = `${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}`.trim();
        document.getElementById("profile-name").textContent = nombreCompleto || "Usuario";
        document.getElementById("profile-email").textContent = usuario?.correo || perfil.correo;
        document.getElementById("profile-edad").textContent = usuario?.edad ? `${usuario.edad} años` : "No especificada";
        document.getElementById("profile-telefono").textContent = usuario?.telefono || "No especificado";

        // Avatar con iniciales
        const avatar = `${usuario?.nombre?.[0] ?? ""}${usuario?.apellido?.[0] ?? ""}`.toUpperCase() || "U";
        document.getElementById("profile-avatar").textContent = avatar;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    // Lógica del botón Cerrar Sesión
    document.getElementById("cierra").addEventListener("click", () => {
        localStorage.clear();
        
        // Mostrar toast
        const toast = document.getElementById("logout-toast");
        toast.classList.remove("hidden");
        toast.classList.add("flex");
        setTimeout(() => {
            toast.classList.remove("opacity-0");
            toast.classList.add("opacity-100");
        }, 10);

        // Redirigir
        setTimeout(() => {
            window.location.href = './index.html';
        }, 1000);
    });

    // Lógica del botón Editar Perfil
    document.getElementById("editar").addEventListener("click", () => {
        // Redirigir a página de edición de perfil
        window.location.href = './edicion.html';
    });
});