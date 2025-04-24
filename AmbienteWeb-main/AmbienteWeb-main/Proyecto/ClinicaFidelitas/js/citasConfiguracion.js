document.addEventListener("DOMContentLoaded", function () {
    fetchCitas();
    fetchPacientesParaDropdown();
    fetchMedicosParaDropdown();
    fetchServiciosParaDropdown();
});

const API_URL = "backend/cita.php";
const PACIENTES_API_URL = "backend/paciente.php";
const MEDICOS_API_URL = "backend/medico.php";
const SERVICIOS_API_URL = "backend/servicio.php";

let citas = [];
let pacientesDropdown = [];
let medicosDropdown = [];
let serviciosDropdown = [];

const citaModal = document.getElementById("citaModal");
const citaForm = document.getElementById("citaForm");
const idPacienteSelect = document.getElementById("id_paciente");
const idMedicoSelect = document.getElementById("id_medico");
const idServicioSelect = document.getElementById("id_servicio");
const fechaCitaInput = document.getElementById("fecha_cita");
const horaCitaInput = document.getElementById("hora_cita");
const motivoCitaInput = document.getElementById("motivo_cita");
const idCitaInput = document.getElementById("id_cita");


function handleAddCitaSubmit(event) {
    event.preventDefault();
    const id_paciente = idPacienteSelect.value;
    const id_medico = idMedicoSelect.value;
    const id_servicio = idServicioSelect.value;
    const fecha_cita = fechaCitaInput.value;
    const hora_cita = horaCitaInput.value;
    const motivo_cita = motivoCitaInput.value.trim();

    if (id_paciente && id_medico && id_servicio && fecha_cita && hora_cita) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_paciente, id_medico, id_servicio, fecha_cita, hora_cita, motivo_cita })
        })
        .then(res => res.json())
        .then(() => {
            fetchCitas();
            bootstrap.Modal.getInstance(citaModal).hide();
        })
        .catch(err => {
            console.error("Error al agregar cita:", err);
            alert("No se pudo agregar la cita.");
        });
    } else {
        alert("Por favor, complete los campos obligatorios.");
    }
}

function handleEditCitaSubmit(event) {
    event.preventDefault();
    const id_cita = idCitaInput.value;
    const id_paciente = idPacienteSelect.value;
    const id_medico = idMedicoSelect.value;
    const id_servicio = idServicioSelect.value;
    const fecha_cita = fechaCitaInput.value;
    const hora_cita = horaCitaInput.value;
    const motivo_cita = motivoCitaInput.value.trim();

    if (id_cita && id_paciente && id_medico && id_servicio && fecha_cita && hora_cita) {
        fetch(`${API_URL}?id_cita=${id_cita}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cita, id_paciente, id_medico, id_servicio, fecha_cita, hora_cita, motivo_cita })
        })
        .then(res => res.json())
        .then(() => {
            fetchCitas();
            bootstrap.Modal.getInstance(citaModal).hide();
        })
        .catch(err => {
            console.error("Error al editar cita:", err);
            alert("No se pudo editar la cita.");
        });
    } else {
        alert("Por favor, complete los campos obligatorios.");
    }
}

// Configuración del modal
citaModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = citaModal.querySelector(".modal-title");

    citaForm.removeEventListener("submit", handleAddCitaSubmit);
    citaForm.removeEventListener("submit", handleEditCitaSubmit);
    citaForm.reset();
    idCitaInput.value = "";

    if (relatedTarget && relatedTarget.textContent.trim() === "Agregar Cita") {
        modalTitle.textContent = "Agregar Cita";
        // Llenar los dropdowns al abrir el modal de agregar
        populatePacientesDropdown();
        populateMedicosDropdown();
        populateServiciosDropdown();
        citaForm.addEventListener("submit", handleAddCitaSubmit);
    } else if (relatedTarget && relatedTarget.classList.contains("btn-warning")) {
        modalTitle.textContent = "Modificar Cita";
        const citaId = relatedTarget.getAttribute("data-id");
        const cita = citas.find(c => c.id_cita == citaId);
        if (cita) {
            idPacienteSelect.value = cita.id_paciente;
            idMedicoSelect.value = cita.id_medico;
            idServicioSelect.value = cita.id_servicio;
            fechaCitaInput.value = cita.fecha_cita;
            horaCitaInput.value = cita.hora_cita;
            motivoCitaInput.value = cita.motivo_cita;
            idCitaInput.value = cita.id_cita;
            // Llenar los dropdowns al abrir el modal de editar
            populatePacientesDropdown();
            populateMedicosDropdown();
            populateServiciosDropdown();
            citaForm.addEventListener("submit", handleEditCitaSubmit);
        }
    }
});

// Limpieza del modal al cerrarse
citaModal.addEventListener("hidden.bs.modal", function () {
    citaForm.reset();
    citaForm.removeEventListener("submit", handleAddCitaSubmit);
    citaForm.removeEventListener("submit", handleEditCitaSubmit);
});

function fetchCitas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            citas = data;
            renderCitas();
        })
        .catch(err => {
            console.error("Error al obtener citas:", err);
            alert("No se pudieron cargar las citas.");
        });
}

function renderCitas() {
    const tbody = document.getElementById("citasTableBody");
    tbody.innerHTML = "";

    if (citas.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = '<td colspan="7" class="text-center">No hay citas registradas</td>';
        tbody.appendChild(row);
        return;
    }

    citas.forEach(cita => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cita.id_cita}</td>
            <td>${cita.id_paciente}</td>
            <td>${cita.id_medico}</td>
            <td>${cita.id_servicio}</td>
            <td>${cita.fecha_cita}</td>
            <td>${cita.hora_cita}</td>
            <td>${cita.motivo_cita || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#citaModal" data-id="${cita.id_cita}">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCita(${cita.id_cita})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteCita(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
        fetch(`${API_URL}?id_cita=${id}`, {
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
            fetchCitas();
        })
        .catch(err => {
            console.error("Error al eliminar cita:", err);
            alert("No se pudo eliminar la cita.");
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
    const select = document.getElementById("id_paciente");
    select.innerHTML = '<option value="">Seleccionar Paciente</option>';
    pacientesDropdown.forEach(paciente => {
        const option = document.createElement("option");
        option.value = paciente.id_paciente;
        option.textContent = paciente.nombre_paciente + ' ' + paciente.apellido_paciente;
        select.appendChild(option);
    });
}

function fetchMedicosParaDropdown() {
    fetch(MEDICOS_API_URL)
        .then(res => res.json())
        .then(data => {
            medicosDropdown = data;
            populateMedicosDropdown();
        })
        .catch(err => {
            console.error("Error al obtener médicos para el dropdown:", err);
        });
}

function populateMedicosDropdown() {
    const select = document.getElementById("id_medico");
    select.innerHTML = '<option value="">Seleccionar Médico</option>';
    medicosDropdown.forEach(medico => {
        const option = document.createElement("option");
        option.value = medico.id_medico;
        option.textContent = medico.nombre_medico + ' ' + medico.apellido_medico;
        select.appendChild(option);
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
    const select = document.getElementById("id_servicio");
    select.innerHTML = '<option value="">Seleccionar Servicio</option>';
    serviciosDropdown.forEach(servicio => {
        const option = document.createElement("option");
        option.value = servicio.id_servicio;
        option.textContent = servicio.nombre_servicio;
        select.appendChild(option);
    });
}