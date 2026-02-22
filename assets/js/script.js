/* =========================================================
   Helpers
   ========================================================= */

// OBS: atalho para pegar 1 elemento
function $(selector) {
  return document.querySelector(selector);
}

// OBS: atalho para pegar vários elementos
function $$(selector) {
  return document.querySelectorAll(selector);
}

/* =========================================================
   NAV: active on click + scroll spy
   ========================================================= */

function setupNav() {
  const navLinks = $$(".nav__link");
  const header = $(".header");
  const sections = $$("section");

  // OBS: se não existir nav ou header, não quebra o site
  if (!navLinks.length || !header || !sections.length) return;

  // OBS: ativa link no clique
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // OBS: sombra do header ao rolar
  function updateHeaderShadow() {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }

  // OBS: marca link ativo conforme section visível
  function updateActiveLinkOnScroll() {
    let currentSection = "";
    const headerHeight = header.offsetHeight; // OBS: lê a altura real do header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // OBS: compensação do header fixo
      if (window.scrollY >= sectionTop - headerHeight - sectionHeight / 4) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // OBS: roda 1 vez ao carregar (estado inicial)
  updateHeaderShadow();
  updateActiveLinkOnScroll();

  // OBS: roda sempre que rolar
  window.addEventListener("scroll", () => {
    updateHeaderShadow();
    updateActiveLinkOnScroll();
  });
}

/* =========================================================
   PROJECTS: carousel arrows + disable
   ========================================================= */

function setupCarousel() {
  const track = $(".projects__track");
  const nextButton = $(".projects__next");
  const prevButton = $(".projects__prev");

  // OBS: se não existir carrossel, não quebra
  if (!track || !nextButton || !prevButton) return;

  const scrollAmount = 240; // OBS: ajuste fino se quiser

    /* =========================================================
     Drag com mouse (desktop)
     ========================================================= */

  let isDragging = false;  // OBS: controla se está arrastando
  let startX;              // OBS: posição inicial do mouse
  let scrollLeft;          // OBS: posição inicial do scroll

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    track.classList.add("is-dragging"); // opcional (estético)

    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  track.addEventListener("mouseup", () => {
    isDragging = false;
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    e.preventDefault(); // OBS: evita seleção de texto

    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2; // OBS: velocidade do drag (ajustável)

    track.scrollLeft = scrollLeft - walk;
  });

  function updateButtons() {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    // OBS: se não tem overflow, esconde as duas
    if (maxScrollLeft <= 0) {
      prevButton.classList.add("is-disabled");
      nextButton.classList.add("is-disabled");
      return;
    }

    const threshold = 5; // OBS: evita “piscar” na borda

    if (track.scrollLeft <= threshold) prevButton.classList.add("is-disabled");
    else prevButton.classList.remove("is-disabled");

    if (track.scrollLeft >= maxScrollLeft - threshold) nextButton.classList.add("is-disabled");
    else nextButton.classList.remove("is-disabled");
  }

  // OBS: clique direita
  nextButton.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  // OBS: clique esquerda
  prevButton.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  // OBS: atualiza quando usuário arrasta/rola manualmente
  track.addEventListener("scroll", updateButtons);

  // OBS: atualiza ao redimensionar (desktop/tela dividida/mobile)
  window.addEventListener("resize", updateButtons);

  // OBS: estado inicial
  updateButtons();
}

/* =========================================================
   CONTACT: simple validation + feedback
   ========================================================= */

function setupContactForm() {
  const form = $("#contact-form");
  if (!form) return; // OBS: evita erro se não existir

  const nameInput = $("#name");
  const emailInput = $("#email");
  const messageInput = $("#message");
  const feedback = $(".form__feedback");

  // OBS: função simples pra validar email (mínimo viável)
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // OBS: limpa estado visual dos campos
  function clearFieldStates() {
    [nameInput, emailInput, messageInput].forEach((el) => el.classList.remove("is-invalid"));
    feedback.classList.remove("is-error", "is-success");
    feedback.textContent = "";
  }

  // OBS: mostra mensagem (erro/sucesso)
  function setFeedback(message, type) {
    feedback.textContent = message;
    feedback.classList.remove("is-error", "is-success");
    feedback.classList.add(type === "error" ? "is-error" : "is-success");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // OBS: impede envio real por enquanto (sem backend)

    clearFieldStates();

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    let hasError = false;

    // OBS: valida nome
    if (nameValue.length < 2) {
      nameInput.classList.add("is-invalid");
      hasError = true;
    }

    // OBS: valida email
    if (!isValidEmail(emailValue)) {
      emailInput.classList.add("is-invalid");
      hasError = true;
    }

    // OBS: valida mensagem
    if (messageValue.length < 10) {
      messageInput.classList.add("is-invalid");
      hasError = true;
    }

    if (hasError) {
      setFeedback("Por favor, revise os campos destacados.", "error");
      return;
}

setFeedback("Mensagem enviada com sucesso!", "success");

    // OBS: sucesso (aqui depois ligamos com backend / EmailJS / etc.)
    setFeedback("Message sent successfully!", "success");
    form.reset();
  });
}

/* =========================================================
   Init
   ========================================================= */

// OBS: garante que o HTML já carregou antes de rodar JS
document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupCarousel();
  setupContactForm();
});