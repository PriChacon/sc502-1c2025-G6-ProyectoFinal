document.addEventListener("DOMContentLoaded", function() {
    // especialidades y doctores
    const especialidades = {
        "Medicina General": ["Dr. Juan Pérez", "Dr. María Gómez"],
        "Pediatría": ["Dr. Luis Ramírez", "Dr. Ana Rodríguez"],
        "Ginecología": ["Dr. Fernando Sánchez", "Dra. Laura Fernández"],
        "Cardiología": ["Dr. Jorge Herrera", "Dr. Patricia López"],
        "Dermatología": ["Dr. Andrés Castro", "Dra. Sofia Muñoz"],
        "Fisioterapia": ["Dr. Carlos Méndez", "Dra. Elena Vargas"],
        "Psicología": ["Dr. Ricardo Morales", "Dra. Valeria Ortega"],
        "Medicina Interna": ["Dr. Sergio Ramírez", "Dra. Natalia Jiménez"],
        "Geriatría": ["Dr. Ernesto Paniagua", "Dra. Beatriz Solano"],
        "Obstetricia": ["Dr. Gabriel Torres", "Dra. Mónica Herrera"],
        "Gastroenterología": ["Dr. Álvaro Rojas", "Dra. Carolina Castro"]
    };

    const selectEspecialidad = document.getElementById('especialidad');
    const selectDoctor = document.getElementById('doctor');
    const selectHora = document.getElementById('hora');

    
    Object.keys(especialidades).forEach(esp => {
        let option = document.createElement('option');
        option.value = esp;
        option.textContent = esp;
        selectEspecialidad.appendChild(option);
    });

    // Llenar el select de horas
    for (let i = 8; i <= 20; i++) {
        let hour = i < 10 ? '0' + i : i;
        let option = document.createElement('option');
        option.value = `${hour}:00`;
        option.textContent = `${hour}:00`;
        selectHora.appendChild(option);
    }

    //Actualizar doctores cuando se seleccione una especialidad
    selectEspecialidad.addEventListener("change", function() {
        const doctores = especialidades[this.value] || [];
        selectDoctor.innerHTML = ""; // Limpiar doctores previos

        let defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione un doctor";
        selectDoctor.appendChild(defaultOption);

        doctores.forEach(doc => {
            let option = document.createElement('option');
            option.value = doc;
            option.textContent = doc;
            selectDoctor.appendChild(option);
        });
    });

    document.getElementById('citaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const especialidad = document.getElementById('especialidad').value;
        const doctor = document.getElementById('doctor').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;

        console.log("Cita agendada:", { nombre, email, telefono, especialidad, doctor, fecha, hora });
        
        alert("Cita agendada con éxito!");
        this.reset(); 
    });
});
