document.addEventListener("DOMContentLoaded", () => {
  // Cargar citas guardadas (o un arreglo por defecto si está vacío)
  let appointmentsList = JSON.parse(
    localStorage.getItem("kivetsoftAppointments"),
  ) || [
    {
      ownerName: "Carlos Gómez",
      ownerPhone: "3104567890",
      petName: "Firulais",
      petType: "Perro",
      service: "Consulta Veterinaria",
      date: "2026-11-10",
      time: "09:00",
      status: "Pendiente",
      notes: "Nervioso al secador",
    },
  ];

  const tbody = document.getElementById("admin-appointments-tbody");
  const searchInput = document.getElementById("search-input");

  const totalEl = document.getElementById("total-appointments");
  const todayEl = document.getElementById("today-appointments");
  const pendingGroomingEl = document.getElementById("pending-grooming");
  const pendingConsultationsEl = document.getElementById(
    "pending-consultations",
  );

  const toggleBtn = document.getElementById("toggle-manual-form");
  const manualFormContainer = document.getElementById("manual-form-container");
  const manualAppointmentForm = document.getElementById(
    "manual-appointment-form",
  );
  const printAgendaBtn = document.getElementById("print-agenda-btn");

  if (toggleBtn && manualFormContainer) {
    toggleBtn.addEventListener("click", () => {
      if (manualFormContainer.style.display === "none") {
        manualFormContainer.style.display = "block";
        toggleBtn.textContent = "❌ Cerrar Formulario Manual";
      } else {
        manualFormContainer.style.display = "none";
        toggleBtn.textContent = "➕ Agendar Cita Telefónica / Presencial";
      }
    });
  }

  if (manualAppointmentForm) {
    manualAppointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newManualAppt = {
        ownerName: document.getElementById("manual-owner").value,
        ownerPhone: document.getElementById("manual-phone").value,
        petName: document.getElementById("manual-pet").value,
        petType: document.getElementById("manual-pet-type").value,
        service: document.getElementById("manual-service").value,
        date: document.getElementById("manual-date").value,
        time: document.getElementById("manual-time").value,
        status: "Pendiente",
        notes: "",
      };

      appointmentsList.push(newManualAppt);
      localStorage.setItem(
        "kivetsoftAppointments",
        JSON.stringify(appointmentsList),
      );

      manualAppointmentForm.reset();
      manualFormContainer.style.display = "none";
      toggleBtn.textContent = "➕ Agendar Cita Telefónica / Presencial";

      renderTable();
      alert("¡Cita registrada correctamente desde recepción!");
    });
  }

  if (printAgendaBtn) {
    printAgendaBtn.addEventListener("click", () => {
      window.print();
    });
  }

  function updateKPIs(list) {
    if (totalEl) totalEl.textContent = list.length;
    const todayStr = new Date().toISOString().split("T")[0];

    if (todayEl) {
      todayEl.textContent = list.filter((a) => a.date === todayStr).length;
    }

    if (pendingGroomingEl) {
      pendingGroomingEl.textContent = list.filter(
        (a) =>
          (a.service.toLowerCase().includes("baño") ||
            a.service.toLowerCase().includes("peluquería")) &&
          (a.status || "Pendiente") === "Pendiente",
      ).length;
    }

    if (pendingConsultationsEl) {
      pendingConsultationsEl.textContent = list.filter(
        (a) =>
          (a.service.toLowerCase().includes("consulta") ||
            a.service.toLowerCase().includes("control") ||
            a.service.toLowerCase().includes("vacunación")) &&
          (a.status || "Pendiente") === "Pendiente",
      ).length;
    }
  }

  function renderTable(filterText = "") {
    if (!tbody) return;
    tbody.innerHTML = "";

    const filteredList = appointmentsList.filter((appt) => {
      const query =
        `${appt.ownerName} ${appt.petName} ${appt.service}`.toLowerCase();
      return query.includes(filterText.toLowerCase());
    });

    updateKPIs(filteredList);

    filteredList.forEach((appt) => {
      const realIndex = appointmentsList.indexOf(appt);
      const currentStatus = appt.status || "Pendiente";
      const currentNotes = appt.notes || "";
      const charCount = currentNotes.length;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${appt.ownerName}</td>
        <td>${appt.ownerPhone}</td>
        <td>${appt.petName} (${appt.petType})</td>
        <td>${appt.service}</td>
        <td>${appt.date} - ${appt.time}</td>
        <td>
          <div class="notes-container">
            <textarea class="notes-textarea" data-index="${realIndex}" maxlength="250" placeholder="Añadir observaciones (máx. 250 carac.)...">${currentNotes}</textarea>
            <div class="notes-footer">
              <span class="char-counter"><strong id="count-${realIndex}">${charCount}</strong>/250</span>
              <button class="btn-save-note" data-index="${realIndex}">Actualizar</button>
            </div>
          </div>
        </td>
        <td>
          <select class="status-select" data-index="${realIndex}">
            <option value="Pendiente" ${currentStatus === "Pendiente" ? "selected" : ""}>🟡 Pendiente</option>
            <option value="Completada" ${currentStatus === "Completada" ? "selected" : ""}>🟢 Completada</option>
            <option value="Cancelada" ${currentStatus === "Cancelada" ? "selected" : ""}>🔴 Cancelada</option>
          </select>
        </td>
        <td class="no-print"><button class="btn-delete" data-index="${realIndex}">Eliminar</button></td>
      `;
      tbody.appendChild(row);
    });

    // Actualizar contador en tiempo real al escribir
    document.querySelectorAll(".notes-textarea").forEach((textarea) => {
      textarea.addEventListener("input", (e) => {
        const idx = e.target.getAttribute("data-index");
        const currentLength = e.target.value.length;
        const counterSpan = document.getElementById(`count-${idx}`);
        if (counterSpan) counterSpan.textContent = currentLength;
      });
    });

    // Acción del botón Actualizar nota
    document.querySelectorAll(".btn-save-note").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        const textarea = document.querySelector(
          `.notes-textarea[data-index="${idx}"]`,
        );

        if (textarea) {
          appointmentsList[idx].notes = textarea.value;
          localStorage.setItem(
            "kivetsoftAppointments",
            JSON.stringify(appointmentsList),
          );
          alert(
            `¡Nota actualizada y registrada con éxito para ${appointmentsList[idx].petName}!`,
          );
        }
      });
    });

    // Evento para cambiar estado
    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const idx = e.target.getAttribute("data-index");
        appointmentsList[idx].status = e.target.value;
        renderTable(searchInput ? searchInput.value : "");
      });
    });

    // Evento para eliminar
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        appointmentsList.splice(idx, 1);
        renderTable(searchInput ? searchInput.value : "");
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderTable(e.target.value);
    });
  }

  renderTable();
});
