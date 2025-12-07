// función de visibilidad del ojito
document.getElementById('toggle-password').addEventListener("click", function() {

    const passwordLogin = document.getElementById('password');
    const eyeOpen = document.getElementById('eye-icon-open');
    const eyeClose = document.getElementById('eye-icon-closed');

    // verificar si la contraseña está oculta
    const isHidden = passwordLogin.type === 'password';

    // cambiar password a texto
    passwordLogin.type = isHidden ? 'text' : 'password';

    // alteración de iconos según el estado
    eyeOpen.classList.toggle('hidden', !isHidden);
    eyeClose.classList.toggle('hidden', isHidden);
});


// función de visibilidad del ojito para confirmar contraseña
document.getElementById('toggle-password-confirm').addEventListener("click", function() {

    const passwordConfirm = document.getElementById('password-confirm');
    const eyeOpenConfirm = document.getElementById('eye-confirm-open');
    const eyeCloseConfirm = document.getElementById('eye-confirm-closed');

    const isHidden = passwordConfirm.type === 'password';

    passwordConfirm.type = isHidden ? 'text' : 'password';

    eyeOpenConfirm.classList.toggle('hidden', !isHidden);
    eyeCloseConfirm.classList.toggle('hidden', isHidden);
});
