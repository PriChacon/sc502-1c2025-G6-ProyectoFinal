document.addEventListener("DOMContentLoaded", function () {
    const serviceTableBody = document.getElementById('serviceTableBody');
    let servicios = [];

    function fetchServicios() {
        fetch('servicios.php')
            .then(res => res.json())
            .then(data => {
                servicios = data;
                renderTable();
            });
    }

    function renderTable() {
        serviceTableBody.innerHTML = '';
        servicios.forEach((servicio, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${servicio.nombre_servicio}</td>
                <td>${servicio.descripcion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editService(${index})">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${servicio.id_servicio})">Eliminar</button>
                </td>
            `;
            serviceTableBody.appendChild(row);
        });
    }

    window.saveService = function (title, description, index = null) {
        const servicio = {
            title,
            description
        };

        let method = 'POST';
        let url = 'servicios.php';

        if (index !== null) {
            servicio.id = servicios[index].id_servicio;
            method = 'PUT';
        }

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicio)
        })
        .then(() => fetchServicios());
    };

    window.deleteService = function (id) {
        fetch('servicios_api.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${id}`
        })
        .then(() => fetchServicios());
    };

    window.editService = function (index) {
        const servicio = servicios[index];
        document.getElementById('serviceName').value = servicio.nombre_servicio;
        document.getElementById('serviceDescription').value = servicio.descripcion;
        document.getElementById('serviceIndex').value = index;

        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
    };

    fetchServicios();
});
