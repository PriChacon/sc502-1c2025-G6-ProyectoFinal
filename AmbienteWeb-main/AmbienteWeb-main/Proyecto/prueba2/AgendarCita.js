document.addEventListener("DOMContentLoaded", function() {
    const especialidades = [
        "Medicina General", "Pediatría", "Ginecología", "Cardiología", "Dermatología",
        "Fisioterapia", "Psicología", "Medicina Interna", "Geriatría", "Obstetricia", "Gastroenterología"
    ];

    const selectEspecialidad = document.getElementById('especialidad');
    especialidades.forEach(esp => {
        let option = document.createElement('option');
        option.value = esp;
        option.textContent = esp;
        selectEspecialidad.appendChild(option);
    });

    const selectHora = document.getElementById('hora');
    for (let i = 8; i <= 20; i++) {
        let hour = i < 10 ? '0' + i : i;
        let option = document.createElement('option');
        option.value = `${hour}:00`;
        option.textContent = `${hour}:00`;
        selectHora.appendChild(option);
    }

    document.getElementById('citaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const especialidad = document.getElementById('especialidad').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;

        
        console.log("Cita agendada:", { nombre, email, telefono, especialidad, fecha, hora });
        
        alert("Cita agendada con éxito!");
        this.reset(); 
    });
});
ß