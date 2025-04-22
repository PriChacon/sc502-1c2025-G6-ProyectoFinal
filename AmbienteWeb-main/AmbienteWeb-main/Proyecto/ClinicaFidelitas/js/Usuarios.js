document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    loadRoles(); 
});

const API_URL = 'backend/usuario.php';

let usuarios = [];
let roles = [];

const userModal = document.getElementById('userModal');
userModal.addEventListener('show.bs.modal', event => {
    const relatedTarget = event.relatedTarget;
    const modalTitle = userModal.querySelector('.modal-title');
    const userNameInput = userModal.querySelector('#userName');
    const userPasswordInput = userModal.querySelector('#userPassword');
    const userRoleSelect = userModal.querySelector('#userRole');
    const userIdInput = userModal.querySelector('#userId');

    if (relatedTarget && relatedTarget.textContent.trim() === 'Agregar Usuario') {
        modalTitle.textContent = 'Agregar Usuario';
        userNameInput.value = '';
        userPasswordInput.value = '';
        if (userRoleSelect.options.length > 0) {
            userRoleSelect.selectedIndex = 0;
        }
        userIdInput.value = '';
    } else if (relatedTarget && relatedTarget.classList.contains('btn-warning')) {
        modalTitle.textContent = 'Modificar Usuario'; 
    }
});

function fetchUsers() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error || 'Error al obtener usuarios'); });
            }
            return res.json();
        })
        .then(data => {
            usuarios = data;
            renderUsers();
        })
        .catch(error => console.error('Error al obtener usuarios:', error));
}

function loadRoles() {
    fetch(`${API_URL}?action=getRoles`)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error || 'Error al obtener roles'); });
            }
            return res.json();
        })
        .then(data => {
            roles = data;
            populateRoleDropdown();
        })
        .catch(error => console.error('Error al obtener roles:', error));
}

function populateRoleDropdown() {
    const roleSelect = document.getElementById('userRole');
    roleSelect.innerHTML = '';

    roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id_rol;
        option.textContent = rol.nombre_rol;
        roleSelect.appendChild(option);
    });
}

function renderUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    usuarios.forEach((usuario, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.nombre_usuario}</td>
            <td>${'*'.repeat(usuario.contraseña.length)}</td>
            <td>${usuario.nombre_rol}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${index})" data-bs-toggle="modal" data-bs-target="#userModal">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${usuario.id_usuario})">Eliminar</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

function saveUser(event) {
    event.preventDefault();
    const nombre_usuario = document.getElementById('userName').value;
    const contraseña = document.getElementById('userPassword').value;
    const id_rol = document.getElementById('userRole').value;
    const id_usuario = document.getElementById('userId').value;

    const data = {
        nombre_usuario: nombre_usuario,
        id_rol: id_rol
    };

    if (!id_usuario || contraseña) {
        data.contraseña = contraseña;
    }

    const method = id_usuario ? 'PUT' : 'POST';
    if (id_usuario) data.id_usuario = id_usuario;

    fetch(API_URL, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error || 'Error al guardar usuario'); });
        }
        return res.json();
    })
    .then(() => {
        document.getElementById('userForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        fetchUsers();
    })
    .catch(error => console.error('Error al guardar usuario:', error));
}

function deleteUser(id_usuario) {
    if (!confirm('¿Desea eliminar este usuario?')) return;

    fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error || 'Error al eliminar usuario'); });
        }
        return res.json();
    })
    .then(() => fetchUsers())
    .catch(error => console.error('Error al eliminar usuario:', error));
}

function editUser(index) {
    console.log("Índice recibido:", index);
    console.log("Array de usuarios:", usuarios);
    if (usuarios && usuarios[index]) {
        const usuario = usuarios[index];
        document.getElementById('userName').value = usuario.nombre_usuario;
        document.getElementById('userRole').value = usuario.id_rol;
        document.getElementById('userId').value = usuario.id_usuario;
        document.getElementById('userPassword').value = '';
        new bootstrap.Modal(document.getElementById('userModal')).show();
    } else {
        console.error("Error: No se encontró usuario en el índice:", index);
    }
}