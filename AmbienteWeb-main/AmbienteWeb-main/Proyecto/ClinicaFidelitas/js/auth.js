document.addEventListener('DOMContentLoaded', function () {
    loadMenu();
});

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
            updateLoginLogoutLink();
        } else {
            console.error('No se encontró el contenedor del menú (menu-container).');
        }
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

async function checkAdminRole() {
    const configuracionesMenu = document.getElementById('configuracionesMenu');
    if (!configuracionesMenu) {
        return;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        try {
            const response = await fetch('backend/check_admin.php', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                configuracionesMenu.style.display = data.isAdmin ? 'block' : 'none';
            } else {
                console.error('Error al verificar el rol de administrador:', response.status);
                configuracionesMenu.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al verificar el rol de administrador:', error);
            configuracionesMenu.style.display = 'none';
        }
    } else {
 
        configuracionesMenu.style.display = 'none';
    }
}

function updateLoginLogoutLink() {
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const agendarCitaLink = document.getElementById('agendarCitaLink');
    const agendarCitaItem = document.getElementById('agendar-cita-item');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (loginLogoutLink) {
        if (isLoggedIn) {
            loginLogoutLink.textContent = 'Cerrar Sesión';
            loginLogoutLink.className = 'btn btn-outline-danger';
            loginLogoutLink.href = '#';
            loginLogoutLink.removeEventListener('click', logoutHandler);
            loginLogoutLink.addEventListener('click', logoutHandler);
        } else {
            loginLogoutLink.textContent = 'Iniciar Sesión';
            loginLogoutLink.className = 'btn btn-outline-primary';
            loginLogoutLink.href = 'login.html';
            loginLogoutLink.removeEventListener('click', logoutHandler);
        }
    }

    if (agendarCitaLink) {
        agendarCitaLink.style.display = isLoggedIn ? 'block' : 'none';
    }
    if (agendarCitaItem) {
        agendarCitaItem.style.display = isLoggedIn ? 'block' : 'none';
    }
}

function logoutHandler(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    loadMenu();
}