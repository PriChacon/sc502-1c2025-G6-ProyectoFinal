document.addEventListener("DOMContentLoaded", function () {
    const servicios = [
        {
            id: 1,
            title: "Medicina General",
            description: "Atención médica integral para pacientes de todas las edades. Diagnóstico y tratamiento de enfermedades comunes, chequeos regulares y asesoramiento en salud preventiva."
        },
        {
            id: 2,
            title: "Pediatría",
            description: "Cuidado especializado para niños y adolescentes. Incluye controles de crecimiento, vacunaciones, tratamiento de enfermedades infantiles y asesoramiento para padres."
        },
        {
            id: 3,
            title: "Ginecología",
            description: "Atención integral de la salud femenina. Exámenes de rutina, tratamiento de trastornos ginecológicos, planificación familiar y atención durante el embarazo."
        },
        {
            id: 4,
            title: "Cardiología",
            description: "Diagnóstico y tratamiento de enfermedades del corazón. Incluye electrocardiogramas, ecocardiografías, pruebas de esfuerzo y asesoramiento en prevención cardiovascular."
        },
        {
            id: 5,
            title: "Dermatología",
            description: "Cuidado de la piel, cabello y uñas. Tratamiento de afecciones dermatológicas, detección temprana de cáncer de piel y procedimientos cosméticos menores."
        },
        {
            id: 6,
            title: "Fisioterapia",
            description: "Rehabilitación física para lesiones musculoesqueléticas, neurológicas y deportivas. Terapias manuales, ejercicios terapéuticos y asesoramiento ergonómico."
        },
        {
            id: 7,
            title: "Laboratorio Clínico",
            description: "Análisis de sangre, orina y otros fluidos corporales para diagnóstico y seguimiento de condiciones médicas. Resultados rápidos y precisos."
        },
        {
            id: 8,
            title: "Servicio de Emergencias",
            description: "Atención médica inmediata para situaciones urgentes. Disponible 24/7, con personal altamente capacitado y equipamiento de última generación."
        },
        {
            id: 9,
            title: "Psicología",
            description: "Atención en salud mental para adultos y niños. Terapia individual y grupal, evaluaciones psicológicas y tratamiento de trastornos emocionales y conductuales."
        },
        {
            id: 10,
            title: "Medicina Interna",
            description: "Diagnóstico y tratamiento de enfermedades complejas en adultos. Manejo de condiciones crónicas, evaluaciones pre-operatorias y cuidado integral del paciente."
        },
        {
            id: 11,
            title: "Geriatría",
            description: "Atención especializada para adultos mayores. Manejo de enfermedades relacionadas con la edad, evaluación de la función cognitiva y física, y cuidados paliativos."
        },
        {
            id: 12,
            title: "Obstetricia",
            description: "Cuidado integral durante el embarazo, parto y posparto. Incluye controles prenatales, ecografías, preparación para el parto y atención de embarazos de alto riesgo."
        },
        {
            id: 13,
            title: "Gastroenterología",
            description: "Diagnóstico y tratamiento de enfermedades del sistema digestivo. Incluye endoscopias, colonoscopias, manejo de enfermedades hepáticas y trastornos gastrointestinales."
        }
    ];
    const taskList = document.getElementById('Servicios-list') || null; // Para servicios.html
    const serviceTableBody = document.getElementById('serviceTableBody') || null; // Para serviciosConfiguracion.html

    // Función para renderizar servicios en servicios.html
    function renderCards() {
        if (!taskList) return;
        taskList.innerHTML = '';
        servicios.forEach(function (servicio) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-6 col-lg-4 mb-4 d-flex justify-content-center';
            taskCard.innerHTML = `
                <div class="card shadow-sm" style="width: 18rem; border-radius: 10px;">
                    <div class="card-body text-center">
                        <h5 class="card-title text-primary">${servicio.title}</h5>
                        <p class="card-text text-muted">${servicio.description}</p>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);
        });
    }

    // Función para renderizar servicios en serviciosConfiguracion.html
    function renderTable() {
        if (!serviceTableBody) return;
        serviceTableBody.innerHTML = '';
        servicios.forEach((servicio, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${servicio.title}</td>
                <td>${servicio.description}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editService(${index})">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${index})">Eliminar</button>
                </td>
            `;
            serviceTableBody.appendChild(row);
        });
    }

    // Función para agregar o modificar un servicio
    window.saveService = function (title, description, index = null) {
        if (index === null) {
            // Agregar nuevo servicio
            const newService = {
                id: servicios.length + 1,
                title,
                description
            };
            servicios.push(newService);
        } else {
            // Modificar servicio existente
            servicios[index].title = title;
            servicios[index].description = description;
        }
        renderTable();
    };

    // Función para eliminar un servicio
    window.deleteService = function (index) {
        servicios.splice(index, 1);
        renderTable();
    };

    // Función para editar un servicio
    window.editService = function (index) {
        const servicio = servicios[index];
        document.getElementById('serviceName').value = servicio.title;
        document.getElementById('serviceDescription').value = servicio.description;
        document.getElementById('serviceIndex').value = index;

        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
    };

    // Renderizar según la página
    renderCards();
    renderTable();
});
