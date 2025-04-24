document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPassword = document.getElementById('forgotPassword');
    const loginError = document.getElementById('loginError'); 
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        //envia los datos al servidor usando POST y el HEADER con el formato de dato que se va a enviar
        const response = await fetch('backend/login.php',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({nombre_usuario: email, contraseña: password})
        });
        //obtenemos la respuesta del servidor en formato JSON
        const result = await response.json();

        if(response.ok){
            //login exitoso
            localStorage.setItem('isLoggedIn', 'true'); 
            window.location.href ='index.html';
        }else{
            loginError.style.display = 'block';
            loginError.textContent = result.error;
        }

      
    });

    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Función de recuperación de contraseña no implementada.');
    });
});