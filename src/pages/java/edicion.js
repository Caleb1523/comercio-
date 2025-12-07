document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    
    if (!sesionActiva) {
        window.location.href = './login.html';
        return;
    }

    const perfil = JSON.parse(localStorage.getItem("usuario"));

    if (!perfil || !perfil.correo) {
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    let usuario = null;

    // Cargar datos actuales del usuario
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

        // Rellenar el formulario con los datos actuales
        document.getElementById("input-email").value = usuario?.correo || perfil.correo;
        document.getElementById("input-nombre").value = usuario?.nombre || "";
        document.getElementById("input-apellido").value = usuario?.apellido || "";
        document.getElementById("input-edad").value = usuario?.edad || "";
        document.getElementById("input-telefono").value = usuario?.telefono || "";

        // Actualizar avatar
        const avatar = `${usuario?.nombre?.[0] ?? ""}${usuario?.apellido?.[0] ?? ""}`.toUpperCase() || "U";
        document.getElementById("profile-avatar").textContent = avatar;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        mostrarToast("Error al cargar los datos", "error");
        return;
    }

    // Manejar el envío del formulario
    document.getElementById("form-edicion").addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("input-email").value.trim();
        const nombre = document.getElementById("input-nombre").value.trim();
        const apellido = document.getElementById("input-apellido").value.trim();
        const edad = parseInt(document.getElementById("input-edad").value);
        const telefono = document.getElementById("input-telefono").value.trim();

        // Validaciones
        if (!correo || !correo.includes("@")) {
            mostrarToast("Debes ingresar un correo válido", "error");
            return;
        }

        if (!nombre || !apellido) {
            mostrarToast("El nombre y apellido son obligatorios", "error");
            return;
        }

        if (isNaN(edad) || edad < 1 || edad > 120) {
            mostrarToast("La edad debe ser un número válido entre 1 y 120", "error");
            return;
        }

        if (!telefono) {
            mostrarToast("El teléfono es obligatorio", "error");
            return;
        }

        const btnGuardar = document.getElementById("btn-guardar");
        const textoOriginal = btnGuardar.innerHTML;
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
        `;

        try {
            const res = await fetch("https://ecomercej.onrender.com/api/perfil/actualizar", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailActual: perfil.correo,
                    emailNuevo: correo,
                    nombre,
                    apellido,
                    edad,
                    telefono
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al actualizar perfil");
            }

            const usuarioActualizado = {
                ...perfil,
                correo: correo,
                nombre,
                apellido
            };

            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
            mostrarToast("¡Perfil actualizado correctamente!", "success");

            setTimeout(() => {
                window.location.href = './index.html';
            }, 1500);

        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            mostrarToast(error.message || "Error al actualizar el perfil", "error");
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = textoOriginal;
        }
    });

    // Botón Cancelar
    document.getElementById("btn-cancelar").addEventListener("click", () => {
        window.location.href = './perfil.html';
    });

    // ⚠️ BOTÓN ELIMINAR - MOVIDO AQUÍ DENTRO DEL DOMContentLoaded
    document.getElementById("btn-eliminar").addEventListener("click", async () => {
        const confirmar = confirm(
            "⚠️ ¿Seguro que deseas eliminar tu cuenta? Esta acción es permanente."
        );

        if (!confirmar) return;

        const btnEliminar = document.getElementById("btn-eliminar");
        const textoOriginal = btnEliminar.innerHTML;
        btnEliminar.disabled = true;
        btnEliminar.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Eliminando...
        `;

        try {
            const res = await fetch("https://ecomercej.onrender.com/api/perfil/eliminar", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: perfil.correo })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error eliminando la cuenta");
            }

            mostrarToast("Tu cuenta ha sido eliminada correctamente", "success");
            
            setTimeout(() => {
                localStorage.clear();
                window.location.href = "./login.html";
            }, 1500);

        } catch (error) {
            console.error("❌ Error:", error);
            mostrarToast(error.message || "No se pudo eliminar tu cuenta", "error");
            btnEliminar.disabled = false;
            btnEliminar.innerHTML = textoOriginal;
        }
    });

    // Actualizar avatar cuando cambien nombre o apellido
    document.getElementById("input-nombre").addEventListener("input", actualizarAvatar);
    document.getElementById("input-apellido").addEventListener("input", actualizarAvatar);
});

function actualizarAvatar() {
    const nombre = document.getElementById("input-nombre").value.trim();
    const apellido = document.getElementById("input-apellido").value.trim();
    const avatar = `${nombre[0] || ""}${apellido[0] || ""}`.toUpperCase() || "U";
    document.getElementById("profile-avatar").textContent = avatar;
}

function mostrarToast(mensaje, tipo = "success") {
    const toast = document.getElementById("toast-notification");
    const toastMessage = document.getElementById("toast-message");
    
    toast.classList.remove("bg-green-600", "bg-red-600", "bg-blue-600");
    
    if (tipo === "error") {
        toast.classList.add("bg-red-600");
    } else if (tipo === "info") {
        toast.classList.add("bg-blue-600");
    } else {
        toast.classList.add("bg-green-600");
    }
    
    toastMessage.textContent = mensaje;
    
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.remove("opacity-0");
        toast.classList.add("opacity-100");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 500);
    }, 3000);
}