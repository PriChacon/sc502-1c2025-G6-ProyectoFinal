document.addEventListener("DOMContentLoaded", function () {
    fetchEspecialidad();
});

const API_URL = "backend/especialidad.php";
let especialidades = [];

const especialidadModal = document.getElementById("especialidadModal");

especialidadModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = especialidadModal.querySelector(".modal-title");
    const especialidadNameInput = especialidadModal.querySelector("#especialidadName");
    const especialidadIdInput = especialidadModal.querySelector("#especialidadId");
    const especialidadForm = document.getElementById("especialidadForm");

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
}
);

function fetchEspecialidad() {
    fetch(API_URL)
        .then((res) => {
            if (!res.ok) {
                return res.json().then((err) => {
                    throw new Error(err.error || "Error al obtener especialidades");
                });
            }
            return res.json();
        })
        .then((data) => {
            especialidades = data;
            renderEspecialidad();
        })
        .catch((error) => {
            console.error("Error al obtener especialidades:", error);
            alert("Error al cargar las especialidades. Por favor, verifica la conexión con el servidor.");
        });
}


function renderEspecialidad() {
    const especialidadTableBody = document.querySelector("#especialidadTableBody");
    especialidadTableBody.innerHTML = "";

    especialidades.forEach((especialidad) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${especialidad.id_especialidad}</td>
            <td>${especialidad.nombre_especialidad}</td>
            <td>
                <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#especialidadModal" data-id="${especialidad.id_especialidad}">Modificar</button>
                <button class="btn btn-danger" onclick="deleteEspecialidad(${especialidad.id_especialidad})">Eliminar</button>
            </td>
        `;
        especialidadTableBody.appendChild(row);
    });
}


function deleteEspecialidad (id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta especialidad?")) {
        fetch(`${API_URL}?id=${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || "Error al eliminar la especialidad");
                    });
                }
                return res.json();
            })
            .then(() => {
                fetchEspecialidad();
            })
            .catch((error) => {
                console.error("Error al eliminar la especialidad:", error);
                alert("Error al eliminar la especialidad. Por favor, verifica la conexión con el servidor.");
            });
    }
}

function handleAddSubmit(event) {
    event.preventDefault();
    const especialidadNameInput = document.getElementById("especialidadName");
    const especialidadName = especialidadNameInput.value.trim();

    if (especialidadName) {
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre_especialidad: especialidadName }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || "Error al agregar especialidad");
                    });
                }
                return res.json();
            })
            .then(() => {
                fetchEspecialidad();
                especialidadModal.hide(); 
            })
            .catch((error) => {
                console.error("Error al agregar especialidad:", error);
                alert("Error al agregar la especialidad. Por favor, verifica la conexión con el servidor.");
            });
    } else {
        alert("Por favor, ingresa un nombre de especialidad válido.");
    }
}

function handleEditSubmit(event) {
    event.preventDefault();
    const especialidadNameInput = document.getElementById("especialidadName");
    const especialidadIdInput = document.getElementById("especialidadId");
    const especialidadName = especialidadNameInput.value.trim();
    const especialidadId = especialidadIdInput.value;

    if (especialidadName) {
        fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_especialidad: especialidadId, nombre_especialidad: especialidadName }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || "Error al modificar especialidad");
                    });
                }
                return res.json();
            })
            .then(() => {
                fetchEspecialidad();
                especialidadModal.hide(); 
            })
            .catch((error) => {
                console.error("Error al modificar especialidad:", error);
                alert("Error al modificar la especialidad. Por favor, verifica la conexión con el servidor.");
            });
    } else {
        alert("Por favor, ingresa un nombre de especialidad válido.");
    }
}

function closeModal() {
    const modal = bootstrap.Modal.getInstance(especialidadModal);
    if (modal) {
        modal.hide();
    }
}