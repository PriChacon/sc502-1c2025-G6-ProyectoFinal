document.addEventListener("DOMContentLoaded", function () {
    fetchMedicos();
    fetchEspecialidadesParaDropdown();
});

const API_URL = "backend/medico.php"; 
const ESPECIALIDADES_API_URL = "backend/especialidad.php";
let medicos = [];
let especialidadesDropdown = [];

const medicoModal = document.getElementById("medicoModal");
const medicoForm = document.getElementById("medicoForm");
const nombreMedicoInput = document.getElementById("nombreMedico");
const apellidoMedicoInput = document.getElementById("apellidoMedico");
const especialidadMedicoSelect = document.getElementById("especialidadMedico");
const telefonoMedicoInput = document.getElementById("telefonoMedico");
const horarioMedicoInput = document.getElementById("horarioMedico");
const idMedicoInput = document.getElementById("idMedico");

// Handlers para el envío del formulario
function handleAddMedicoSubmit(event) {
    event.preventDefault();
    const nombre = nombreMedicoInput.value.trim();
    const apellido = apellidoMedicoInput.value.trim();
    const id_especialidad = especialidadMedicoSelect.value;
    const telefono = telefonoMedicoInput.value.trim();
    const horario = horarioMedicoInput.value.trim();

    if (nombre && apellido && id_especialidad) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_medico: nombre, apellido: apellido, id_especialidad: id_especialidad, telefono: telefono, horario: horario })
        })
        .then(res => res.json())
        .then(() => {
            fetchMedicos();
            bootstrap.Modal.getInstance(medicoModal).hide();
        })
        .catch(err => {
            console.error("Error al agregar médico:", err);
            alert("No se pudo agregar el médico.");
        });
    } else {
        alert("Por favor, complete todos los campos obligatorios.");
    }
}

function handleEditMedicoSubmit(event) {
    event.preventDefault();
    const id_medico = idMedicoInput.value;
    const nombre = nombreMedicoInput.value.trim();
    const apellido = apellidoMedicoInput.value.trim();
    const id_especialidad = especialidadMedicoSelect.value;
    const telefono = telefonoMedicoInput.value.trim();
    const horario = horarioMedicoInput.value.trim();

    if (nombre && apellido && id_especialidad && id_medico) {
        fetch(`${API_URL}?id=${id_medico}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_medico: id_medico,
                nombre_medico: nombre,
                apellido: apellido,
                id_especialidad: id_especialidad,
                telefono: telefono,
                horario: horario
            })
        })
        .then(res => res.json())
        .then(() => {
            fetchMedicos();
            bootstrap.Modal.getInstance(medicoModal).hide();
        })
        .catch(err => {
            console.error("Error al editar médico:", err);
            alert("No se pudo editar el médico.");
        });
    } else {
        alert("Por favor, complete todos los campos obligatorios.");
    }
}

// Configuración del modal
medicoModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = medicoModal.querySelector(".modal-title");

    medicoForm.removeEventListener("submit", handleAddMedicoSubmit);
    medicoForm.removeEventListener("submit", handleEditMedicoSubmit);

    if (relatedTarget && relatedTarget.textContent.trim() === "Agregar Médico") {
        modalTitle.textContent = "Agregar Médico";
        medicoForm.reset();
        idMedicoInput.value = "";
 
        populateEspecialidadesDropdown();
        medicoForm.addEventListener("submit", handleAddMedicoSubmit);
    } else if (relatedTarget && relatedTarget.classList.contains("btn-warning")) {
        modalTitle.textContent = "Modificar Médico";
        const medicoId = relatedTarget.getAttribute("data-id");
        const medico = medicos.find(m => m.id_medico == medicoId);
        if (medico) {
            nombreMedicoInput.value = medico.nombre_medico;
            apellidoMedicoInput.value = medico.apellido;
            especialidadMedicoSelect.value = medico.id_especialidad;
            telefonoMedicoInput.value = medico.telefono;
            horarioMedicoInput.value = medico.horario;
            idMedicoInput.value = medico.id_medico;
            populateEspecialidadesDropdown();
            medicoForm.addEventListener("submit", handleEditMedicoSubmit);
        }
    }
});

medicoModal.addEventListener("hidden.bs.modal", function () {
    medicoForm.reset();
    medicoForm.removeEventListener("submit", handleAddMedicoSubmit);
    medicoForm.removeEventListener("submit", handleEditMedicoSubmit);
});

function fetchMedicos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            medicos = data;
            renderMedicos();
        })
        .catch(err => {
            console.error("Error al obtener médicos:", err);
            alert("No se pudieron cargar los médicos.");
        });
}

function renderMedicos() {
    const tbody = document.getElementById("medicosTableBody");
    tbody.innerHTML = "";

    if (medicos.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = '<td colspan="7" class="text-center">No hay médicos registrados</td>';
        tbody.appendChild(row);
        return;
    }

    medicos.forEach(medico => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${medico.id_medico}</td>
            <td>${medico.nombre_medico}</td>
            <td>${medico.apellido}</td>
            <td>${medico.nombre_especialidad}</td>
            <td>${medico.telefono || ''}</td>
            <td>${medico.horario || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#medicoModal" data-id="${medico.id_medico}">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMedico(${medico.id_medico})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteMedico(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este médico?")) {
        fetch(`${API_URL}?id=${id}`, {
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
            fetchMedicos();
        })
        .catch(err => {
            console.error("Error al eliminar médico:", err);
            alert("No se pudo eliminar el médico.");
        });
    }
}

function fetchEspecialidadesParaDropdown() {
    fetch(ESPECIALIDADES_API_URL)
        .then(res => res.json())
        .then(data => {
            especialidadesDropdown = data;
            populateEspecialidadesDropdown();
        })
        .catch(err => {
            console.error("Error al obtener especialidades para el dropdown:", err);
        });
}

function populateEspecialidadesDropdown() {
    especialidadMedicoSelect.innerHTML = '<option value="">Seleccionar Especialidad</option>';
    especialidadesDropdown.forEach(especialidad => {
        const option = document.createElement("option");
        option.value = especialidad.id_especialidad;
        option.textContent = especialidad.nombre_especialidad;
        especialidadMedicoSelect.appendChild(option);
    });
}