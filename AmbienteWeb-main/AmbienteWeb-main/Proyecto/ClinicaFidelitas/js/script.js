document.addEventListener('DOMContentLoaded', function() {
 

    const configuracionesMenu = document.getElementById('configuracionesMenu');


    async function loadMenu() {
        try {
            const response = await fetch('menu.html');
            if (!response.ok) {
                console.error('Error al cargar el menú:', response.status);
                return;
            }
            const menuHTML = await response.text();
            const menuContainer = document.getElementById('menu-container');
            if (menuContainer) {
                menuContainer.innerHTML = menuHTML;

                checkAdminRole();
                updateLoginLogoutLink(); // Si tienes una función para actualizar el enlace de login/logout
            } else {
                console.error('No se encontró el contenedor del menú (menu-container).');
            }
        } catch (error) {
            console.error('Error al cargar el menú:', error);
        }
    }
    async function checkAdminRole() {
        try {
            const response = await fetch('backend/check_admin.php', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.isAdmin) {
                    if (configuracionesMenu) {
                        configuracionesMenu.style.display = 'block'; 
                    }
                } else {
                    if (configuracionesMenu) {
                        configuracionesMenu.style.display = 'none'; 
                    }
                }
            } else {
                console.error('Error al verificar el rol de administrador:', response.status);
                if (configuracionesMenu) {
                    configuracionesMenu.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error al verificar el rol de administrador:', error);
            if (configuracionesMenu) {
                configuracionesMenu.style.display = 'none';
            }
        }
    }

    
    checkAdminRole();
});