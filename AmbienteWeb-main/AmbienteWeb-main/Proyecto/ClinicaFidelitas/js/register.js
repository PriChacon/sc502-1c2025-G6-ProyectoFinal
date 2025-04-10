document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombre_usuario = document.getElementById('nombre_usuario').value;
        const contraseña = document.getElementById('contraseña').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (contraseña !== confirmPassword) {
            registerError.innerHTML = `<div class="alert alert-danger" role="alert">
                <strong>Error:</strong> Las contraseñas no coinciden.
            </div>`;
            return;
        }

        try {
            const response = await fetch('backend/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_usuario: nombre_usuario,
                    contraseña: contraseña
                })
            });

            const result = await response.json();

            if (response.ok) {
                registerError.innerHTML = `<div class="alert alert-success" role="alert">
                    Usuario registrado con éxito.
                </div>`;
                setTimeout(() => window.location.href = "index.html", 3000);
            } else {
                registerError.innerHTML = `<div class="alert alert-danger" role="alert">
                    ${result.error || 'Error al registrar usuario.'}
                </div>`;
            }

        } catch (error) {
            registerError.innerHTML = `<div class="alert alert-danger" role="alert">
                Error de red o del servidor.
            </div>`;
        }
    });
});
