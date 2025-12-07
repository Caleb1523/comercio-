// script de login - TechStore Pro

// Esperar a que toda la página esté cargada
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Página cargada correctamente - Sistema listo');

    // URL de la API
    const API_URL = "https://ecomercej.onrender.com/api/login";

    // Evento al enviar el formulario
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();


        // Elementos del DOM
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        // Ocultar error anterior
        errorDiv.classList.add('hidden');

        // Recoger datos
        const datos = {
            correo: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };

        // Validar vacíos
        if (!datos.correo || !datos.password) {
            errorMsg.textContent = 'Por favor completar los datos';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Cambiar botón mientras se procesa
        btn.disabled = true;
        btn.textContent = 'Iniciando sesión...';

        try {
            // Enviar datos al servidor
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            // Si la respuesta es exitosa
            if (response.ok) {
                console.log('201 - Inicio de sesión exitoso');

                // Guardar sesión en localStorage
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    userID: resultado.usuario.userID,
                    nombre: resultado.usuario.nombre,
                    apellido: resultado.usuario.apellido,
                    edad: resultado.usuario.edad,
                    correo: resultado.usuario.correo,
                    telefono: resultado.usuario.telefono,
                    password: resultado.usuario.password
                }));

                // Mostrar mensaje de éxito
                errorDiv.classList.remove('hidden');

                // Cambiar fondo y borde del contenedor
                errorDiv.classList.remove('bg-red-50', 'border-red-200', 'text-red-600');
                errorDiv.classList.add('bg-green-100', 'border-green-200', 'text-green-800');

                // Cambiar color del ícono dentro del mensaje
                const icon = errorDiv.querySelector('svg');
                if (icon) {
                    icon.classList.remove('text-red-600');
                    icon.classList.add('text-green-800');
                }

                // Cambiar el texto del mensaje
                errorMsg.textContent = 'Inicio de sesión exitoso. Redirigiendo...';


                // Redirigir
                setTimeout(() => window.location.href = 'productos.html', 3000);

            } else {
                // Error de credenciales
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Iniciar sesión';
            }

        } catch (error) {
            console.error('Error 404 - Error de conexión con el servidor');
            errorMsg.textContent = 'Error de conexión con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Iniciar sesión';
        }

    });
});
