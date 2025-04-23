document.addEventListener("DOMContentLoaded", function () {
    fetchRoles();
});

const API_URL = "backend/rol.php";
let roles = [];

// Corregido: cambiar roleModal a rolModal para coincidir con el HTML
const rolModal = document.getElementById("rolModal");

rolModal.addEventListener("show.bs.modal", function (event) {
    const relatedTarget = event.relatedTarget;
    const modalTitle = rolModal.querySelector(".modal-title");
    const roleNameInput = rolModal.querySelector("#rolName");
    const roleIdInput = rolModal.querySelector("#rolId");
    const roleForm = document.getElementById("rolForm");

    roleForm.removeEventListener("submit", handleAddSubmit);
    roleForm.removeEventListener("submit", handleEditSubmit);

    if (relatedTarget && relatedTarget.textContent.trim() === "Agregar Rol") {
        modalTitle.textContent = "Agregar Rol";
        roleNameInput.value = "";
        roleIdInput.value = "";
        roleForm.addEventListener("submit", handleAddSubmit);
    } else if (relatedTarget && relatedTarget.classList.contains("btn-warning")) {
        modalTitle.textContent = "Modificar Rol";
        // Corregido: Usar data-id para obtener el ID del rol
        const roleId = relatedTarget.getAttribute("data-id");
        const role = roles.find(r => r.id_rol == roleId);
        if (role) {
            roleNameInput.value = role.nombre_rol;
            roleIdInput.value = role.id_rol;
            roleForm.addEventListener("submit", handleEditSubmit);
        }
    }
});

function fetchRoles() {
    fetch(API_URL)
        .then((res) => {
            if (!res.ok) {
                return res.json().then((err) => {
                    throw new Error(err.error || "Error al obtener roles");
                });
            }
            return res.json();
        })
        .then((data) => {
            roles = data;
            renderRoles();
        })
        .catch((error) => {
            console.error("Error al obtener roles:", error);
            alert("Error al cargar los roles. Por favor, verifica la conexión con el servidor.");
        });
}

function renderRoles() {
    const roleTableBody = document.querySelector("#rolTableBody");
    roleTableBody.innerHTML = "";

    roles.forEach((role) => {
        const row = document.createElement("tr");
        // Agregado: Mostrar el ID del rol en una columna oculta con data-id
        row.innerHTML = `
            <td data-id="${role.id_rol}">${role.nombre_rol}</td>
            <td>
                <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#rolModal" data-id="${role.id_rol}">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRole(${role.id_rol})">Eliminar</button>
            </td>
        `;
        roleTableBody.appendChild(row);
    });
}

function handleAddSubmit(event) {
    event.preventDefault();
    const roleNameInput = document.getElementById("rolName");
    const roleName = roleNameInput.value.trim();

    if (roleName) {
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre_rol: roleName }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || "Error al agregar rol");
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log("Rol agregado:", data);
                fetchRoles(); // Recargar la lista de roles
                const modal = bootstrap.Modal.getInstance(rolModal);
                modal.hide();
            })
            .catch((error) => {
                console.error("Error al agregar rol:", error);
                alert("Error al agregar el rol. Por favor, inténtalo de nuevo.");
            });
    } else {
        alert("El nombre del rol no puede estar vacío.");
    }
}

function handleEditSubmit(event) {
    event.preventDefault();
    const roleNameInput = document.getElementById("rolName");
    const roleIdInput = document.getElementById("rolId");
    const roleName = roleNameInput.value.trim();
    const roleId = roleIdInput.value;

    if (roleName) {
        fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_rol: roleId, nombre_rol: roleName }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || "Error al modificar rol");
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log("Rol modificado:", data);
                fetchRoles(); // Recargar la lista de roles
                const modal = bootstrap.Modal.getInstance(rolModal);
                modal.hide();
            })
            .catch((error) => {
                console.error("Error al modificar rol:", error);
                alert("Error al modificar el rol. Por favor, inténtalo de nuevo.");
            });
    } else {
        alert("El nombre del rol no puede estar vacío.");
    }
}

function deleteRole(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este rol?")) {
        fetch(API_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_rol: id }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || "Error al eliminar rol");
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log("Rol eliminado:", data);
                fetchRoles(); // Recargar la lista de roles
            })
            .catch((error) => {
                console.error("Error al eliminar rol:", error);
                alert("Error al eliminar el rol. Por favor, inténtalo de nuevo.");
            });
    }
}