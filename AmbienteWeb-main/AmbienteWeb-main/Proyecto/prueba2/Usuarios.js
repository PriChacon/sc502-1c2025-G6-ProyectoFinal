let usuarios = [];

function renderUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    usuarios.forEach((usuario, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.name}</td>
            <td>${usuario.email}</td>
            <td>${usuario.role}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${index})">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">Eliminar</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

function saveUser(name, email, role, index = null) {
    if (index === null) {
        usuarios.push({ name, email, role });
    } else {
        usuarios[index] = { name, email, role };
    }
    renderUsers();
}

function deleteUser(index) {
    usuarios.splice(index, 1);
    renderUsers();
}

function editUser(index) {
    const usuario = usuarios[index];
    document.getElementById('userName').value = usuario.name;
    document.getElementById('userEmail').value = usuario.email;
    document.getElementById('userRole').value = usuario.role;
    document.getElementById('userIndex').value = index;

    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', renderUsers);