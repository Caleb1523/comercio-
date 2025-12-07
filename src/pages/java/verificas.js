
// Lógica para verificar código y cambiar contraseña

const API_URL = 'https://ecomercej.onrender.com/api/recuperar';

document.addEventListener('DOMContentLoaded', () => {
    // Obtener email guardado
    const email = localStorage.getItem('emailRecuperacion');
    
    if (!email) {
        mostrarNotificacion('Sesión expirada. Vuelve a solicitar el código', 'error');
        setTimeout(() => {
            window.location.href = './recuperar.html';
        }, 2000);
        return;
    }

    // Mostrar email en el texto
    const profileEmail = document.getElementById('profile-email');
    if (profileEmail) {
        profileEmail.textContent = `Ingresa el código enviado a: ${email}`;
    }

    // Elementos del DOM
    const inputCodigo = document.getElementById('codigo-verificacion');
    const inputPassword = document.getElementById('password');
    const inputPasswordConfirm = document.getElementById('password-confirm'); 
    const btnCambiarPassword = document.getElementById('cambio-contraseña');
    const togglePassword = document.getElementById('toggle-password');
    const togglePasswordConfirm = document.getElementById('toggle-password-confirm');

    // Formatear input de código (solo números)
    inputCodigo.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });

    // Toggle visibility password
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = inputPassword.type === 'password' ? 'text' : 'password';
            inputPassword.type = type;
            
            const eyeOpen = document.getElementById('eye-icon-open');
            const eyeClosed = document.getElementById('eye-icon-closed');
            
            eyeOpen.classList.toggle('hidden');
            eyeClosed.classList.toggle('hidden');
        });
    }

    // Toggle visibility password confirm
    if (togglePasswordConfirm) {
        togglePasswordConfirm.addEventListener('click', () => {
            const type = inputPasswordConfirm.type === 'password' ? 'text' : 'password';
            inputPasswordConfirm.type = type;
            
            const eyeOpen = document.getElementById('eye-confirm-open');
            const eyeClosed = document.getElementById('eye-confirm-closed');
            
            eyeOpen.classList.toggle('hidden');
            eyeClosed.classList.toggle('hidden');
        });
    }

    // Validación en tiempo real de contraseña
    inputPassword.addEventListener('input', validarPasswordTiempoReal);
    inputPasswordConfirm.addEventListener('input', validarPasswordTiempoReal);

    // Cambiar contraseña
    btnCambiarPassword.addEventListener('click', async () => {
        const codigo = inputCodigo.value.trim();
        const password = inputPassword.value;
        const passwordConfirm = inputPasswordConfirm.value;

        // Validaciones
        if (!codigo || codigo.length !== 6) {
            mostrarNotificacion('Por favor ingresa el código de 6 dígitos', 'error');
            inputCodigo.focus();
            return;
        }

        if (!password) {
            mostrarNotificacion('Por favor ingresa una contraseña', 'error');
            inputPassword.focus();
            return;
        }

        if (password.length < 6) {
            mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
            inputPassword.focus();
            return;
        }

        if (password !== passwordConfirm) {
            mostrarNotificacion('Las contraseñas no coinciden', 'error');
            inputPasswordConfirm.focus();
            return;
        }

        // Deshabilitar botón
        btnCambiarPassword.disabled = true;
        btnCambiarPassword.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cambiando contraseña...
        `;

        try {
            console.log('Enviando datos:', { correo: email, codigo, nuevaPassword: password }); // Debug

            const response = await fetch(`${API_URL}/cambiar-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo: email,
                    codigo: codigo,
                    nuevaPassword: password
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Debug

            if (response.ok) {
                mostrarNotificacion('Contraseña actualizada exitosamente', 'success');
                
                // Limpiar localStorage
                localStorage.removeItem('emailRecuperacion');
                
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
            } else {
                mostrarNotificacion(data.message || 'Error al cambiar la contraseña', 'error');
                btnCambiarPassword.disabled = false;
                btnCambiarPassword.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="currentColor" class="w-6 h-6 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Cambiar contraseña
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión. Intenta nuevamente', 'error');
            btnCambiarPassword.disabled = false;
            btnCambiarPassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Cambiar contraseña
            `;
        }
    });
});

// Validación en tiempo real
function validarPasswordTiempoReal() {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value; // ✅ CORREGIDO
    const errorElements = document.querySelectorAll('#password-error');

    errorElements.forEach(errorElement => {
        if (passwordConfirm && password !== passwordConfirm) {
            errorElement.textContent = 'Las contraseñas no coinciden';
            errorElement.classList.remove('hidden');
        } else if (password && password.length < 6) {
            errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorElement.classList.remove('hidden');
        } else {
            errorElement.classList.add('hidden');
        }
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 transition-all duration-500 ${
        tipo === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    
    notificacion.innerHTML = `
        ${tipo === 'success' ? `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
        ` : `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
        `}
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateY(-20px)';
        setTimeout(() => notificacion.remove(), 500);
    }, 5000);
}