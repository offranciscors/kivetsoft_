document.addEventListener("DOMContentLoaded", () => {
  // --- Arreglo global para almacenar las citas en memoria ---
  const appointmentsList = [
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

  // --- 2. Lógica del Modal de Inicio de Sesión ---
  const btnOpenLogin = document.getElementById("open-login-btn");
  const loginModal = document.getElementById("login-modal");
  const modalClose = document.querySelector(".modal-close");
  const loginForm = document.getElementById("login-form");

  const clientDashboard = document.getElementById("client-dashboard");
  const staffDashboard = document.getElementById("staff-dashboard");
  const clientWelcomeMsg = document.getElementById("client-welcome-msg");
  const mainContent = document.querySelector("main"); // O la estructura principal de tu web

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
  // --- 3. Envío y Bifurcación del Login ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userType = document.getElementById("user-type").value;
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (!userType || !email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      // 1. Cerrar el modal y limpiar el formulario
      loginModal.style.display = "none";
      loginForm.reset();

      // 2. Mostrar el panel correspondiente según el rol
      if (userType === "cliente") {
        clientWelcomeMsg.textContent = `Bienvenido de nuevo, ${email}. Aquí puedes revisar el historial y los servicios de tu mascota.`;
        clientDashboard.style.display = "block";
        staffDashboard.style.display = "none";

        // Desplazar la vista suavemente hacia el panel del cliente
        clientDashboard.scrollIntoView({ behavior: "smooth" });
      } else if (userType === "personal") {
        clientDashboard.style.display = "none";
        staffDashboard.style.display = "block";

        // Cargar la tabla con las citas y actualizar datos
        renderStaffTable();

        // Desplazar la vista suavemente hacia el panel administrativo
        staffDashboard.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // --- Función para renderizar la tabla de citas en el panel del personal ---
  function renderStaffTable() {
    const tbody = document.getElementById("admin-appointments-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    appointmentsList.forEach((appt, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${appt.ownerName}</td>
        <td>${appt.ownerPhone}</td>
        <td>${appt.petName} (${appt.petType})</td>
        <td>${appt.service}</td>
        <td>${appt.date} - ${appt.time}</td>
        <td><button class="btn-delete" data-index="${index}">Completar / Borrar</button></td>
      `;
      tbody.appendChild(row);
    });

    // Agregar evento a los botones de eliminar/completar cita
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        appointmentsList.splice(idx, 1);
        renderStaffTable();
      });
    });
  }
  // --- 4. Lógica del Formulario de Citas (Conecta con el panel del personal) ---
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

      // Agregar la nueva cita al arreglo general para que el personal la vea
      appointmentsList.push(newAppt);

      // Inyectar resumen en el formulario
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

  // Botones de salida o regreso general
  document.querySelectorAll(".btn-logout").forEach((btn) => {
    btn.addEventListener("click", () => {
      clientDashboard.style.display = "none";
      staffDashboard.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});
