document.addEventListener("DOMContentLoaded", function () {
    const contactoData = {
        telefono: "+506 2206-8600",
        correo: "info@clinicafidelitas.com",
        direccion: "San José, Costa Rica",
        redesSociales: [
            { nombre: "Facebook", url: "https://www.facebook.com/clinicafidelitas" },
            { nombre: "Instagram", url: "https://www.instagram.com/clinicafidelitas" },
            { nombre: "Twitter", url: "https://www.twitter.com/clinicafidelitas" }
        ]
    };

    const contentContainer = document.getElementById("contacto-content");

    contentContainer.innerHTML = `
        <div class="col-md-6">
            <h2 class="text-secondary">Información de Contacto</h2>
            <p><strong>Teléfono:</strong> ${contactoData.telefono}</p>
            <p><strong>Correo:</strong> ${contactoData.correo}</p>
            <p><strong>Dirección:</strong> ${contactoData.direccion}</p>
            <h3 class="mt-4">Redes Sociales</h3>
            <ul class="list-unstyled">
                ${contactoData.redesSociales.map(red => `
                    <li><a href="${red.url}" target="_blank" class="text-decoration-none">${red.nombre}</a></li>
                `).join('')}
            </ul>
        </div>
        <div class="col-md-6">
            <h2 class="text-secondary">Envíanos un mensaje</h2>
            <form>
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombre" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                    <label for="mensaje" class="form-label">Mensaje</label>
                    <textarea class="form-control" id="mensaje" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
        </div>
    `;
});
