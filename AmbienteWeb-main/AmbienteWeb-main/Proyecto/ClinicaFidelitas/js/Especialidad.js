document.addEventListener("DOMContentLoaded", function () {
    fetchEspecialidad();
});

const API_URL = "backend/especialidad.php";
let especialidades = [];

const especialidadModal = document.getElementById("especialidadModal");
const especialidadNameInput = document.getElementById("especialidadName");
const especialidadIdInput = document.getElementById("especialidadId");
const especialidadForm = document.getElementById("especialidadForm");

// Handlers for form submission
function handleAddSubmit(event) {
    event.preventDefault();
    const nombre = especialidadNameInput.value.trim();
    if (nombre) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_especialidad: nombre })
        })
        .then(res => res.json())
        .then(() => {
            fetchEspecialidad();
            bootstrap.Modal.getInstance(especialidadModal).hide();
        })
        .catch(err => {
            console.error("Error al agregar:", err);
            alert("No se pudo agregar la especialidad.");
        });
    }
}

function handleEditSubmit(event) {
    event.preventDefault();
    const nombre = especialidadNameInput.value.trim();
    const id = especialidadIdInput.value;
    if (nombre && id) {
        fetch(`${API_URL}?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nombre_especialidad: nombre,
                id_especialidad: id 
            })
        })
        .then(res => res.json())
        .then(() => {
            fetchEspecialidad();
            bootstrap.Modal.getInstance(especialidadModal).hide();
        })
        .catch(err => {
            console.error("Error al editar:", err);
            alert("No se pudo editar la especialidad.");
        });
    }
}

// Modal setup
especialidadModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = especialidadModal.querySelector(".modal-title");

    // Remove old listeners to prevent duplication
    especialidadForm.removeEventListener("submit", handleAddSubmit);
    especialidadForm.removeEventListener("submit", handleEditSubmit);

    if (relatedTarget && relatedTarget.textContent.trim() === "Agregar Especialidad") {
        modalTitle.textContent = "Agregar Especialidad";
        especialidadNameInput.value = "";
        especialidadIdInput.value = "";
        especialidadForm.addEventListener("submit", handleAddSubmit);
    } else if (relatedTarget && relatedTarget.classList.contains("btn-warning")) {
        modalTitle.textContent = "Modificar Especialidad";
        const especialidadId = relatedTarget.getAttribute("data-id");
        const especialidad = especialidades.find(e => e.id_especialidad == especialidadId);
        if (especialidad) {
            especialidadNameInput.value = especialidad.nombre_especialidad;
            especialidadIdInput.value = especialidad.id_especialidad;
            especialidadForm.addEventListener("submit", handleEditSubmit);
        }
    }
});

// Hide modal event - cleanup
especialidadModal.addEventListener("hidden.bs.modal", function () {
    // Reset form
    especialidadForm.reset();
    // Remove event listeners
    especialidadForm.removeEventListener("submit", handleAddSubmit);
    especialidadForm.removeEventListener("submit", handleEditSubmit);
});

function fetchEspecialidad() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            especialidades = data;
            renderEspecialidad();
        })
        .catch(err => {
            console.error("Error al obtener especialidades:", err);
            alert("No se pudieron cargar las especialidades.");
        });
}

function renderEspecialidad() {
    const tbody = document.getElementById("especialidadesTableBody");
    tbody.innerHTML = "";
    
    if (especialidades.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = '<td colspan="3" class="text-center">No hay especialidades registradas</td>';
        tbody.appendChild(row);
        return;
    }
    
    especialidades.forEach(especialidad => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${especialidad.id_especialidad}</td>
            <td>${especialidad.nombre_especialidad}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#especialidadModal" data-id="${especialidad.id_especialidad}">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEspecialidad(${especialidad.id_especialidad})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteEspecialidad(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta especialidad?")) {
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
            fetchEspecialidad();
        })
        .catch(err => {
            console.error("Error al eliminar:", err);
            alert("No se pudo eliminar la especialidad.");
        });
    }
}