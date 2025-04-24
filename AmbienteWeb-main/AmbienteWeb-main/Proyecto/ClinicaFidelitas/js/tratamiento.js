document.addEventListener("DOMContentLoaded", function () {
    fetchTratamientos();
    fetchPacientesParaDropdown();
    fetchServiciosParaDropdown();
});

const API_URL = "backend/tratamiento.php"; // Asegúrate de que esta ruta sea correcta
const PACIENTES_API_URL = "backend/paciente.php"; // Ruta para obtener pacientes
const SERVICIOS_API_URL = "backend/servicio.php"; // Ruta para obtener servicios

let tratamientos = [];
let pacientesDropdown = [];
let serviciosDropdown = [];

const tratamientoModal = document.getElementById("tratamientoModal");
const tratamientoForm = document.getElementById("tratamientoForm");
const idPacienteSelect = document.getElementById("idPaciente");
const idServicioSelect = document.getElementById("idServicio");
const descripcionInput = document.getElementById("descripcion");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const idTratamientoInput = document.getElementById("idTratamiento");

// Handlers para el envío del formulario
function handleAddTratamientoSubmit(event) {
    event.preventDefault();
    const id_paciente = idPacienteSelect.value;
    const id_servicio = idServicioSelect.value;
    const descripcion = descripcionInput.value.trim();
    const fecha_inicio = fechaInicioInput.value;
    const fecha_fin = fechaFinInput.value;

    if (id_paciente && id_servicio && fecha_inicio) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_paciente: id_paciente, id_servicio: id_servicio, descripcion: descripcion, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin })
        })
        .then(res => res.json())
        .then(() => {
            fetchTratamientos();
            bootstrap.Modal.getInstance(tratamientoModal).hide();
        })
        .catch(err => {
            console.error("Error al agregar tratamiento:", err);
            alert("No se pudo agregar el tratamiento.");
        });
    } else {
        alert("Por favor, complete los campos obligatorios.");
    }
}

function handleEditTratamientoSubmit(event) {
    event.preventDefault();
    const id_tratamiento = idTratamientoInput.value;
    const id_paciente = idPacienteSelect.value;
    const id_servicio = idServicioSelect.value;
    const descripcion = descripcionInput.value.trim();
    const fecha_inicio = fechaInicioInput.value;
    const fecha_fin = fechaFinInput.value;

    if (id_tratamiento && id_paciente && id_servicio && fecha_inicio) {
        fetch(`${API_URL}?id_tratamiento=${id_tratamiento}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_tratamiento: id_tratamiento,
                id_paciente: id_paciente,
                id_servicio: id_servicio,
                descripcion: descripcion,
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin
            })
        })
        .then(res => res.json())
        .then(() => {
            fetchTratamientos();
            bootstrap.Modal.getInstance(tratamientoModal).hide();
        })
        .catch(err => {
            console.error("Error al editar tratamiento:", err);
            alert("No se pudo editar el tratamiento.");
        });
    } else {
        alert("Por favor, complete los campos obligatorios.");
    }
}

// Configuración del modal
tratamientoModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = tratamientoModal.querySelector(".modal-title");

    tratamientoForm.removeEventListener("submit", handleAddTratamientoSubmit);
    tratamientoForm.removeEventListener("submit", handleEditTratamientoSubmit);

    if (relatedTarget && relatedTarget.textContent.trim() === "Agregar Tratamiento") {
        modalTitle.textContent = "Agregar Tratamiento";
        tratamientoForm.reset();
        idTratamientoInput.value = "";
        // Llenar los dropdowns al abrir el modal de agregar
        populatePacientesDropdown();
        populateServiciosDropdown();
        tratamientoForm.addEventListener("submit", handleAddTratamientoSubmit);
    } else if (relatedTarget && relatedTarget.classList.contains("btn-warning")) {
        modalTitle.textContent = "Modificar Tratamiento";
        const tratamientoId = relatedTarget.getAttribute("data-id");
        const tratamiento = tratamientos.find(t => t.id_tratamiento == tratamientoId);
        if (tratamiento) {
            idPacienteSelect.value = tratamiento.id_paciente;
            idServicioSelect.value = tratamiento.id_servicio;
            descripcionInput.value = tratamiento.descripcion;
            fechaInicioInput.value = tratamiento.fecha_inicio;
            fechaFinInput.value = tratamiento.fecha_fin;
            idTratamientoInput.value = tratamiento.id_tratamiento;
            // Llenar los dropdowns al abrir el modal de editar
            populatePacientesDropdown();
            populateServiciosDropdown();
            tratamientoForm.addEventListener("submit", handleEditTratamientoSubmit);
        }
    }
});

// Limpieza del modal al cerrarse
tratamientoModal.addEventListener("hidden.bs.modal", function () {
    tratamientoForm.reset();
    tratamientoForm.removeEventListener("submit", handleAddTratamientoSubmit);
    tratamientoForm.removeEventListener("submit", handleEditTratamientoSubmit);
});

function fetchTratamientos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            tratamientos = data;
            renderTratamientos();
        })
        .catch(err => {
            console.error("Error al obtener tratamientos:", err);
            alert("No se pudieron cargar los tratamientos.");
        });
}

function renderTratamientos() {
    const tbody = document.getElementById("tratamientosTableBody");
    tbody.innerHTML = "";

    if (tratamientos.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = '<td colspan="6" class="text-center">No hay tratamientos registrados</td>';
        tbody.appendChild(row);
        return;
    }

    tratamientos.forEach(tratamiento => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tratamiento.id_tratamiento}</td>
            <td>${tratamiento.paciente_nombre}</td>
            <td>${tratamiento.paciente_apellido}</td>
            <td>${tratamiento.descripcion || ''}</td>
            <td>${tratamiento.fecha_inicio}</td>
            <td>${tratamiento.fecha_fin || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#tratamientoModal" data-id="${tratamiento.id_tratamiento}">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTratamiento(${tratamiento.id_tratamiento})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteTratamiento(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este tratamiento?")) {
        fetch(`${API_URL}?id_tratamiento=${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res.json();
        })
        .then(() => {
            fetchTratamientos();
        })
        .catch(err => {
            console.error("Error al eliminar tratamiento:", err);
            alert("No se pudo eliminar el tratamiento.");
        });
    }
}

function fetchPacientesParaDropdown() {
    fetch(PACIENTES_API_URL)
        .then(res => res.json())
        .then(data => {
            pacientesDropdown = data;
            populatePacientesDropdown();
        })
        .catch(err => {
            console.error("Error al obtener pacientes para el dropdown:", err);
        });
}

function populatePacientesDropdown() {
    idPacienteSelect.innerHTML = '<option value="">Seleccionar Paciente</option>';
    pacientesDropdown.forEach(paciente => {
        const option = document.createElement("option");
        option.value = paciente.id_paciente;
        option.textContent = paciente.nombre_paciente + ' ' + paciente.apellido_paciente;
        idPacienteSelect.appendChild(option);
    });
}

function fetchServiciosParaDropdown() {
    fetch(SERVICIOS_API_URL)
        .then(res => res.json())
        .then(data => {
            serviciosDropdown = data;
            populateServiciosDropdown();
        })
        .catch(err => {
            console.error("Error al obtener servicios para el dropdown:", err);
        });
}

function populateServiciosDropdown() {
    idServicioSelect.innerHTML = '<option value="">Seleccionar Servicio</option>';
    serviciosDropdown.forEach(servicio => {
        const option = document.createElement("option");
        option.value = servicio.id_servicio;
        option.textContent = servicio.nombre_servicio;
        idServicioSelect.appendChild(option);
    });
}