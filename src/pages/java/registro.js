// Esperar a que toda la página esté cargada
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Página de registro cargada');

    const form = document.getElementById('registro');
    const API_URL = "https://ecomercej.onrender.com/api/user/register";

    // Evento al enviar el formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log(' Formulario enviado');

        // Elementos del DOM
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Ocultar error anterior
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('bg-green-50', 'border-green-200', 'text-green-600');
        errorDiv.classList.add('bg-red-50', 'border-red-200', 'text-red-600');

        // Recoger datos
        const datos = {
            userID: document.getElementById('userid').value.trim(),
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            edad: parseInt(document.getElementById('edad').value),
            correo: document.getElementById('email').value.trim(),
            telefono: document.getElementById('tel').value.trim(),
            password: document.getElementById('password').value
        };


        // Validaciones
        if (!datos.userID || !datos.nombre || !datos.apellido || !datos.edad || 
            !datos.correo || !datos.telefono || !datos.password) {
            errorMsg.textContent = 'Por favor completa todos los campos';
            errorDiv.classList.remove('hidden');
            console.warn('Campos incompletos');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.correo)) {
            errorMsg.textContent = 'Por favor ingresa un correo válido';
            errorDiv.classList.remove('hidden');
            console.warn('Email inválido');
            return;
        }

        // Validar contraseñas
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            errorMsg.textContent = 'Las contraseñas no coinciden';
            errorDiv.classList.remove('hidden');
            console.warn('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            errorMsg.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorDiv.classList.remove('hidden');
            console.warn('La contraseña muy corta');
            return;
        }

        // Validar términos
        const aceptaTerminos = document.getElementById('remember-me').checked;
        if (!aceptaTerminos) {
            errorMsg.textContent = 'Debes aceptar los términos y condiciones';
            errorDiv.classList.remove('hidden');
            console.warn('Términos no aceptados');
            return;
        }

        // Cambiar botón mientras se procesa
        submitBtn.disabled = true;
        const textoOriginal = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registrando...</span>
            </div>
        `;

        try {
            console.log(' Enviando datos al servidor...');
            
            // Enviar datos al servidor
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            console.log('Respuesta recibida:', response.status);

            const resultado = await response.json();
            console.log('Datos de respuesta:', resultado);

            // Si la respuesta es exitosa
            if (response.ok) {
                console.log('✅ Registro exitoso');

                // Guardar sesión en localStorage
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    userID: resultado.usuario?.userID || datos.userID,
                    nombre: resultado.usuario?.nombre || datos.nombre,
                    apellido: resultado.usuario?.apellido || datos.apellido,
                    edad: resultado.usuario?.edad || datos.edad,
                    correo: resultado.usuario?.correo || datos.correo,
                    telefono: resultado.usuario?.telefono || datos.telefono
                }));

                console.log('Sesión guardada en localStorage');

                // Mostrar mensaje de éxito
                errorDiv.classList.remove('hidden', 'bg-red-50', 'border-red-200', 'text-red-600');
                errorDiv.classList.add('bg-green-50', 'border-green-200', 'text-green-600');

                // Cambiar icono a check
                const icon = errorDiv.querySelector('svg');
                if (icon) {
                    icon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    `;
                }

                errorMsg.textContent = '¡Registro exitoso! Redirigiendo...';

                // Redirigir
                setTimeout(() => {
                    console.log('🔄 Redirigiendo a login...');
                    window.location.href = './login.html';
                }, 2000);

            } else {
                // Error del servidor
                console.error('❌ Error del servidor:', resultado.message);
                errorMsg.textContent = resultado.message || 'Error al registrar usuario';
                errorDiv.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = textoOriginal;
            }

        } catch (error) {
            console.error('❌ Error de conexión:', error);
            errorMsg.textContent = 'Error de conexión con el servidor.';
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = textoOriginal;
        }
    });

    // Validación en tiempo real de contraseñas
    /*
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (this.value && this.value !== password.value) {
                this.classList.add('border-red-500');
                this.classList.remove('border-green-500');
            } else if (this.value && this.value === password.value) {
                this.classList.remove('border-red-500');
                this.classList.add('border-green-500');
            } else {
                this.classList.remove('border-red-500', 'border-green-500');
            }
        });
    }*/

    console.log('✅ Event listeners configurados correctamente');
});