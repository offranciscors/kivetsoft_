document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Lógica del Carrusel ---
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicators = Array.from(
    document.querySelectorAll(".carousel-indicator"),
  );
  let currentIndex = 0;

  const updateCarousel = (index) => {
    slides.forEach((slide, i) =>
      slide.classList.toggle("current-slide", i === index),
    );
    indicators.forEach((dot, i) =>
      dot.classList.toggle("current-slide", i === index),
    );
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel(currentIndex);
  };

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel(currentIndex);
    });
  }
  setInterval(nextSlide, 4000);

  // --- 2. Lógica del Modal de Inicio de Sesión (Solo Personal) ---
  const btnOpenLogin = document.getElementById("open-login-btn");
  const loginModal = document.getElementById("login-modal");
  const modalClose = document.querySelector(".modal-close");
  const loginForm = document.getElementById("login-form");

  if (btnOpenLogin && loginModal) {
    btnOpenLogin.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "flex";
    });
  }

  if (modalClose && loginModal) {
    modalClose.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // --- 3. Envío del Formulario de Inicio de Sesión (Redirección a staff.html) ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      // Redirige directamente al panel independiente del personal
      window.location.href = "staff.html";
    });
  }

  // --- 4. Lógica del Formulario de Citas (Sincronizado con el Panel vía localStorage) ---
  const appointmentForm = document.getElementById("appointment-form");
  const successAlert = document.getElementById("success-alert");
  const appointmentSummary = document.getElementById("appointment-summary");

  if (appointmentForm && successAlert && appointmentSummary) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newAppt = {
        ownerName: document.getElementById("owner-name").value,
        ownerEmail: document.getElementById("owner-email").value,
        ownerPhone: document.getElementById("owner-phone").value,
        petName: document.getElementById("pet-name").value,
        petType: document.getElementById("pet-type").value,
        service: document.getElementById("service-select").value,
        date: document.getElementById("appointment-date").value,
        time: document.getElementById("appointment-time").value,
      };

      // Obtener citas existentes en localStorage o inicializar el arreglo base
      let appointmentsList = JSON.parse(
        localStorage.getItem("kivetsoftAppointments"),
      ) || [
        {
          ownerName: "Carlos Gómez",
          ownerEmail: "carlos@ejemplo.com",
          ownerPhone: "3104567890",
          petName: "Firulais",
          petType: "Perro",
          service: "Consulta Veterinaria",
          date: "2026-11-10",
          time: "09:00",
        },
      ];

      // Agregar la nueva cita y guardarla en el almacenamiento local
      appointmentsList.push(newAppt);
      localStorage.setItem(
        "kivetsoftAppointments",
        JSON.stringify(appointmentsList),
      );

      // Inyectar resumen en el formulario web
      appointmentSummary.innerHTML = `
        <div class="summary-details">
            <p><strong>Dueño:</strong> ${newAppt.ownerName}</p>
            <p><strong>Correo:</strong> ${newAppt.ownerEmail}</p>
            <p><strong>Teléfono:</strong> ${newAppt.ownerPhone}</p>
            <p><strong>Mascota:</strong> ${newAppt.petName} (${newAppt.petType})</p>
            <p><strong>Servicio:</strong> ${newAppt.service}</p>
            <p><strong>Fecha y Hora:</strong> ${newAppt.date} a las ${newAppt.time}</p>
        </div>
      `;

      appointmentForm.style.display = "none";
      successAlert.style.display = "block";
    });
  }
});
