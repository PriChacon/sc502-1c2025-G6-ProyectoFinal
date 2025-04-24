document.addEventListener("DOMContentLoaded", function () {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    } else {

        fetchPacientes();
        fetchEspecialidades();
        fetchServicios();
        populateHoras();

        const especialidadSelect = document.getElementById('especialidad');
        if (especialidadSelect) {
            especialidadSelect.addEventListener('change', function () {
                const especialidadId = this.value;
                if (especialidadId) {
                    fetchDoctores(especialidadId);
                } else {
                    document.getElementById('doctor').innerHTML = '<option value="">Seleccione un doctor</option>';
                }
            });
        }

        const citaForm = document.getElementById('citaForm');
        if (citaForm) {
            citaForm.addEventListener('submit', function (e) {
                e.preventDefault();
                agendarCita();
            });
        }
    }

    const especialidadSelectOutside = document.getElementById('especialidad');
    if (especialidadSelectOutside) {
        especialidadSelectOutside.addEventListener('change', function () {
            const especialidadId = this.value;
            if (especialidadId) {
                fetchDoctores(especialidadId);
            } else {
                document.getElementById('doctor').innerHTML = '<option value="">Seleccione un doctor</option>';
            }
        });
    }

   
});

const PACIENTES_API_URL = "backend/paciente.php";
const ESPECIALIDADES_API_URL = "backend/especialidad.php";
const SERVICIOS_API_URL = "backend/servicio.php";
const DOCTORES_API_URL = "backend/medico.php?id_especialidad=";
const CITAS_API_URL = "backend/cita.php";

function fetchPacientes() {
    fetch(PACIENTES_API_URL)
        .then(response => response.json())
        .then(data => {
            const selectPaciente = document.getElementById('id_paciente');
            if (selectPaciente) {
                data.forEach(paciente => {
                    const option = document.createElement('option');
                    option.value = paciente.id_paciente;
                    option.textContent = `${paciente.nombre_paciente} ${paciente.apellido_paciente || ''}`;
                    selectPaciente.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error al obtener pacientes:", error));
}

function fetchEspecialidades() {
    fetch(ESPECIALIDADES_API_URL)
        .then(response => response.json())
        .then(data => {
            const selectEspecialidad = document.getElementById('especialidad');
            if (selectEspecialidad) {
                data.forEach(especialidad => {
                    const option = document.createElement('option');
                    option.value = especialidad.id_especialidad;
                    option.textContent = especialidad.nombre_especialidad;
                    selectEspecialidad.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error al obtener especialidades:", error));
}

function fetchServicios() {
    fetch(SERVICIOS_API_URL)
        .then(response => response.json())
        .then(data => {
            const selectServicio = document.getElementById('id_servicio');
            if (selectServicio) {
                selectServicio.innerHTML = '<option value="">Seleccione un servicio</option>';
                data.forEach(servicio => {
                    const option = document.createElement('option');
                    option.value = servicio.id_servicio;
                    option.textContent = servicio.nombre_servicio || servicio.descripcion_servicio || `Servicio ID: ${servicio.id_servicio}`;
                    selectServicio.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error al obtener servicios:", error));
}

function fetchDoctores(especialidadId) {
    fetch(`${DOCTORES_API_URL}${especialidadId}`)
        .then(response => response.json())
        .then(data => {
            const selectDoctor = document.getElementById('doctor');
            if (selectDoctor) {
                selectDoctor.innerHTML = '<option value="">Seleccione un doctor</option>';
                data.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id_medico;
                    option.textContent = `${doctor.nombre_medico} ${doctor.apellido || ''}`;
                    selectDoctor.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error al obtener doctores:", error));
}

function populateHoras() {
    const selectHora = document.getElementById('hora_cita');
    if (selectHora) {
        selectHora.innerHTML = '<option value="">Seleccione una hora</option>';
        for (let i = 8; i <= 20; i++) {
            let hour = i < 10 ? '0' + i : i;
            let option = document.createElement('option');
            option.value = `${hour}:00`;
            option.textContent = `${hour}:00`;
            selectHora.appendChild(option);
        }
    }
}

function agendarCita() {
    const id_paciente = document.getElementById('id_paciente').value;
    const id_medico = document.getElementById('doctor').value;
    const id_servicio = document.getElementById('id_servicio').value;
    const fecha_cita = document.getElementById('fecha_cita').value;
    const hora_cita = document.getElementById('hora_cita').value;
    const motivo_cita = document.getElementById('motivo_cita').value;

    const citaData = {
        id_paciente: id_paciente,
        id_medico: id_medico,
        id_servicio: id_servicio,
        fecha_cita: fecha_cita,
        hora_cita: hora_cita,
        motivo_cita: motivo_cita
    };

    fetch(CITAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(citaData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Cita agendada con éxito!");
                const citaFormElement = document.getElementById('citaForm');
                if (citaFormElement) {
                    citaFormElement.reset();
                }
            } else {
                alert("Error al agendar la cita.");
                console.error("Error al agendar la cita:", data);
            }
        })
        .catch(error => {
            alert("Ocurrió un error al agendar la cita.");
            console.error("Error al enviar la cita:", error);
        });
}