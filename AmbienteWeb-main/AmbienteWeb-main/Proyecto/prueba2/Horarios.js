let horarios = [];

function renderSchedules() {
    const scheduleTableBody = document.getElementById('scheduleTableBody');
    scheduleTableBody.innerHTML = '';
    horarios.forEach((horario, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${horario.day}</td>
            <td>${horario.startTime}</td>
            <td>${horario.endTime}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSchedule(${index})">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSchedule(${index})">Eliminar</button>
            </td>
        `;
        scheduleTableBody.appendChild(row);
    });
}

function saveSchedule(day, startTime, endTime, index = null) {
    if (index === null) {
        horarios.push({ day, startTime, endTime });
    } else {
        horarios[index] = { day, startTime, endTime };
    }
    renderSchedules();
}

function deleteSchedule(index) {
    horarios.splice(index, 1);
    renderSchedules();
}

function editSchedule(index) {
    const horario = horarios[index];
    document.getElementById('scheduleDay').value = horario.day;
    document.getElementById('startTime').value = horario.startTime;
    document.getElementById('endTime').value = horario.endTime;
    document.getElementById('scheduleIndex').value = index;

    const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', renderSchedules);