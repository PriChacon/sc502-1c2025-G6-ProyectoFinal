document.addEventListener("DOMContentLoaded", function () {
    const nosotrosData = {
        title: "Sobre Nosotros",
        description: "Somos una empresa dedicada a proporcionar servicios de salud excepcionales, con un enfoque en la calidad y la atención personalizada.",
        mission: "Nuestra misión es mejorar la calidad de vida de nuestros pacientes a través de servicios de salud innovadores y accesibles.",
        vision: "Ser líderes en el sector de la salud, reconocidos por nuestra excelencia y compromiso con el bienestar de la comunidad.",
        values: [
            "Compromiso con la calidad",
            "Atención personalizada",
            "Innovación constante",
            "Ética profesional",
            "Trabajo en equipo"
        ]
    };

    const contentContainer = document.getElementById("nosotros-content");

    contentContainer.innerHTML = `
        <h1 class="text-center mb-4">${nosotrosData.title}</h1>
        <p class="text-muted">${nosotrosData.description}</p>
        <h2 class="text-secondary mt-4">Misión</h2>
        <p>${nosotrosData.mission}</p>
        <h2 class="text-secondary mt-4">Visión</h2>
        <p>${nosotrosData.vision}</p>
        <h2 class="text-secondary mt-4">Valores</h2>
        <ul>
            ${nosotrosData.values.map(value => `<li>${value}</li>`).join("")}
        </ul>
    `;
});