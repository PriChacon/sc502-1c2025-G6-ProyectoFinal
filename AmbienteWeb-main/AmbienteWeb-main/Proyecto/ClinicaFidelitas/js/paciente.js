document.addEventListener("DOMContentLoaded", function () {
    fetchPacientes();
});

const API_URL = "backend/paciente.php"; 
let pacientes = [];

const pacienteModal = document.getElementById("pacienteModal");
const pacienteForm = document.getElementById("pacienteForm");
const nombrePacienteInput = document.getElementById("nombre_paciente");
const apellidoPacienteInput = document.getElementById("apellido_paciente");
const direccionInput = document.getElementById("direccion");
const fechaNacimientoInput = document.getElementById("fecha_nacimiento");
const telefonoInput = document.getElementById("telefono");
const idPacienteInput = document.getElementById("id_paciente");

function handleAddPacienteSubmit(event) {
    event.preventDefault();
    const nombre_paciente = nombrePacienteInput.value;
    const apellido_paciente = apellidoPacienteInput.value;
    const direccion = direccionInput.value;
    const fecha_nacimiento = fechaNacimientoInput.value;
    const telefono = telefonoInput.value;

    if (nombre_paciente && apellido_paciente && direccion && fecha_nacimiento) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_paciente, apellido_paciente, direccion, fecha_nacimiento, telefono })
        })
        .then(res => res.json())
        .then(() => {
            fetchPacientes();
            bootstrap.Modal.getInstance(pacienteModal).hide();
        })
        .catch(err => {
            console.error("Error al agregar paciente:", err);
            alert("No se pudo agregar el paciente.");
        });
    } else {
        alert("Por favor, complete los campos obligatorios.");
    }
}

function handleEditPacienteSubmit(event) {
    event.preventDefault();
    const id_paciente = idPacienteInput.value;
    const nombre_paciente = nombrePacienteInput.value;
    const apellido_paciente = apellidoPacienteInput.value;
    const direccion = direccionInput.value;
    const fecha_nacimiento = fechaNacimientoInput.value;
    const telefono = telefonoInput.value;

    if (id_paciente && nombre_paciente && apellido_paciente && direccion && fecha_nacimiento) {
        fetch(`${API_URL}?id_paciente=${id_paciente}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_paciente, nombre_paciente, apellido_paciente, direccion, fecha_nacimiento, telefono })
        })
        .then(res => res.json())
        .then(() => {
            fetchPacientes();
            bootstrap.Modal.getInstance(pacienteModal).hide();
        })
        .catch(err => {
            console.error("Error al editar paciente:", err);
            alert("No se pudo editar el paciente.");
        });
    } else {
        alert("Por favor, complete los campos obligatorios.");
    }
}

pacienteModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = pacienteModal.querySelector(".modal-title");

    pacienteForm.removeEventListener("submit", handleAddPacienteSubmit);
    pacienteForm.removeEventListener("submit", handleEditPacienteSubmit);
    pacienteForm.reset();
    idPacienteInput.value = "";

    if (relatedTarget && relatedTarget.textContent.trim() === "Agregar Paciente") {
        modalTitle.textContent = "Agregar Paciente";
        pacienteForm.addEventListener("submit", handleAddPacienteSubmit);
    } else if (relatedTarget && relatedTarget.classList.contains("btn-warning")) {
        modalTitle.textContent = "Modificar Paciente";
        const pacienteId = relatedTarget.getAttribute("data-id");
        const paciente = pacientes.find(p => p.id_paciente == pacienteId);
        if (paciente) {
            nombrePacienteInput.value = paciente.nombre_paciente;
            apellidoPacienteInput.value = paciente.apellido_paciente;
            direccionInput.value = paciente.direccion;
            fechaNacimientoInput.value = paciente.fecha_nacimiento;
            telefonoInput.value = paciente.telefono;
            idPacienteInput.value = paciente.id_paciente;
            pacienteForm.addEventListener("submit", handleEditPacienteSubmit);
        }
    }
});

pacienteModal.addEventListener("hidden.bs.modal", function () {
    pacienteForm.reset();
    pacienteForm.removeEventListener("submit", handleAddPacienteSubmit);
    pacienteForm.removeEventListener("submit", handleEditPacienteSubmit);
});

function fetchPacientes() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            pacientes = data;
            renderPacientes();
        })
        .catch(err => {
            console.error("Error al obtener pacientes:", err);
            alert("No se pudieron cargar los pacientes.");
        });
}

function renderPacientes() {
    const tbody = document.getElementById("pacientesTableBody");
    tbody.innerHTML = "";

    if (pacientes.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = '<td colspan="7" class="text-center">No hay pacientes registrados</td>';
        tbody.appendChild(row);
        return;
    }

    pacientes.forEach(paciente => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${paciente.id_paciente}</td>
            <td>${paciente.nombre_paciente}</td>
            <td>${paciente.apellido_paciente}</td>
            <td>${paciente.direccion}</td>
            <td>${paciente.fecha_nacimiento}</td>
            <td>${paciente.telefono || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#pacienteModal" data-id="${paciente.id_paciente}">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deletePaciente(${paciente.id_paciente})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deletePaciente(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
        fetch(`${API_URL}?id_paciente=${id}`, {
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
            fetchPacientes();
        })
        .catch(err => {
            console.error("Error al eliminar paciente:", err);
            alert("No se pudo eliminar el paciente.");
        });
    }
}