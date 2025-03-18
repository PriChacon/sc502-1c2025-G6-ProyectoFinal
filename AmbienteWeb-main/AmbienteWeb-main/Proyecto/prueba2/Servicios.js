document.addEventListener("DOMContentLoaded", function () {

    const servicios = [
        {
            id: 1,
            title: "Consultoría",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
        },
        {
            id: 2,
            title: "Terapia intensiva",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
        },
        {
            id: 3,
            title: "Tratamientos",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
        },
        {
            id: 4,
            title: "Cuidados paliativos",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
        },
        {
            
                id: 5,
                title: "Servicio de enfermería",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
            
        },
        {
            
                id: 6,
                title: "Servicio de ambulancia",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
            
        },
        {
            
            id: 7,
            title: "Servicio de ambulancia",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
        
    },
    {
            
        id: 8,
        title: "Servicio de ambulancia",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget justo."
    
}
    ];

    function loadTasks() {
        const taskList = document.getElementById('Servicios-list');
        taskList.innerHTML = '';
    
        servicios.forEach(function (servicio) {
            // Aquí iteramos sobre cada elemento del arreglo servicios
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-6 col-lg-4 mb-4 d-flex justify-content-center'; // Ajusta el tamaño según la pantalla
            taskCard.innerHTML = `
            <div class="card shadow-sm" style="width: 18rem; border-radius: 10px;">
                <div class="card-body text-center">
                    <h5 class="card-title text-primary">${servicio.title}</h5>
                    <p class="card-text text-muted">${servicio.description}</p>
                </div>
                <div class="card-footer bg-white border-0 text-center">
                    <button class="btn btn-primary btn-sm">Agendar Cita</button>
                </div>    
            </div>
            `;
            taskList.appendChild(taskCard);
        });
    }

    loadTasks();
});