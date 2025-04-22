document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "backend/servicio.php";
    let servicios = [];
    const taskList = document.getElementById('Servicios-list') || null;
    const serviceTableBody = document.getElementById('serviceTableBody') || null;

    async function loadTasks() {
        try {
            const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
            if (response.ok) {
                servicios = await response.json();
                renderCards();
                renderTable();
            } else {
                if (response.status == 401) {
                    window.location.href = "index.html";
                }
                console.error("Error al obtener los Servicios:", response.statusText);
            }

        } catch (err) {
            console.error(err);
        }
    }

    function renderCards() {
        if (!taskList) return;
        taskList.innerHTML = '';
        servicios.forEach(function (servicio) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-6 col-lg-4 mb-4 d-flex justify-content-center';
            taskCard.innerHTML = `
                <div class="card shadow-sm" style="width: 18rem; border-radius: 10px;">
                    <div class="card-body text-center">
                        <h5 class="card-title text-primary">${servicio.nombre_servicio}</h5>
                        <p class="card-text text-muted">${servicio.descripcion}</p>
                        <p class="card-text text-muted">₡${servicio.costo}</p>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);
        });
    }

    function renderTable() {
        if (!serviceTableBody) return;
        serviceTableBody.innerHTML = '';
        servicios.forEach((servicio, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${servicio.nombre_servicio}</td>
                <td>${servicio.descripcion}</td>
                <td>₡${servicio.costo}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editService(${index})">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${index})">Eliminar</button>
                </td>
            `;
            serviceTableBody.appendChild(row);
        });
    }

    window.saveService = async function (nombre_servicio, descripcion, costo, index = null) {
        const servicioData = {
            nombre_servicio,
            descripcion,
            costo
        };

        try {
            if (index === null) {
                // Crear nuevo
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(servicioData)
                });
                if (!response.ok) throw new Error("Error al crear servicio");
            } else {
                // Editar existente
                servicioData.id_servicio = servicios[index].id_servicio;
                const response = await fetch(API_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(servicioData)
                });
                if (!response.ok) throw new Error("Error al editar servicio");
            }

            loadTasks();
        } catch (error) {
            console.error(error);
        }
    };

    window.deleteService = async function (index) {
        const id_servicio = servicios[index].id_servicio;
        try {
            const response = await fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_servicio })
            });
            if (!response.ok) throw new Error("Error al eliminar servicio");
            loadTasks();
        } catch (error) {
            console.error(error);
        }
    };

    window.editService = function (index) {
        const servicio = servicios[index];
        document.getElementById('serviceName').value = servicio.nombre_servicio;
        document.getElementById('serviceDescription').value = servicio.descripcion;
        document.getElementById('serviceCost').value = servicio.costo;
        document.getElementById('serviceIndex').value = index;

        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
    };

    loadTasks();
});
