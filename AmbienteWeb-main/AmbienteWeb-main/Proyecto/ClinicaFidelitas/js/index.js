document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    document.getElementById('current-year').textContent = new Date().getFullYear();

    if (!isLoggedIn) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
    }


    if (window.location.pathname.includes('AgendarCita.html') && !isLoggedIn) {
        window.location.href = 'login.html';
    }
});