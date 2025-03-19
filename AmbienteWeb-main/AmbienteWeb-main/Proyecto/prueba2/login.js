document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPassword = document.getElementById('forgotPassword');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Verificación de las credenciales del administrador
        if (email === 'paciente@gmail.com' && password === 'paciente12345') {
            console.log('Inicio de sesión exitoso');
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            console.log('Credenciales incorrectas');
            alert('Correo electrónico o contraseña incorrectos. Por favor, intente de nuevo.');
        }
    });

    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Función de recuperación de contraseña no implementada.');
    });
});
