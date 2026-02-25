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
    link.addEventListener("click", function (e) {
      e.preventDefault(); // OBS: impede salto brusco padrão

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      const headerHeight = header.offsetHeight;

      if (!targetSection) return;

      // OBS: calcula posição correta compensando header fixo
      const targetPosition =
        targetSection.offsetTop - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
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

  // OBS: evita selecionar texto/imagens ao arrastar no desktop
  track.addEventListener("dragstart", (e) => e.preventDefault());

// OBS: atualiza estado das setas do carrossel
function updateCarouselUI() {
  if (!track || !prevButton || !nextButton) return;

  const maxScrollLeft = track.scrollWidth - track.clientWidth;
  const hasScroll = maxScrollLeft > 5; // verifica se existe scroll real

  // Se não existe scroll, desativa ambas
  if (!hasScroll) {
    prevButton.classList.add("is-disabled");
    nextButton.classList.add("is-disabled");
    return;
  }

  // Se está no início
  if (track.scrollLeft <= 0) {
    prevButton.classList.add("is-disabled");
  } else {
    prevButton.classList.remove("is-disabled");
  }

  // Se está no fim
  if (track.scrollLeft >= maxScrollLeft - 1) {
    nextButton.classList.add("is-disabled");
  } else {
    nextButton.classList.remove("is-disabled");
  }
}

  // Atualiza quando clicar nas setas
  nextButton.addEventListener("click", () => {
    track.scrollBy({ left: 300, behavior: "smooth" });
  });

  prevButton.addEventListener("click", () => {
    track.scrollBy({ left: -300, behavior: "smooth" });
  });

  // Atualiza quando rolar manualmente
  track.addEventListener("scroll", updateCarouselUI);

  // Atualiza ao redimensionar tela
  window.addEventListener("resize", updateCarouselUI);

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

  // OBS: wrapper (pra ligar/desligar dica)
const projectsWrapper = document.querySelector(".projects__wrapper");

// OBS: atualiza estado das setas e da dica
function updateCarouselUI() {
  if (!track || !prevButton || !nextButton) return;

  const maxScrollLeft = track.scrollWidth - track.clientWidth;
  const hasScroll = maxScrollLeft > 5;

  // OBS: liga/desliga a dica via classe no wrapper
  if (projectsWrapper) {
    projectsWrapper.classList.toggle("has-scroll", hasScroll);
  }

  // OBS: se não tem scroll, some com setas
  if (!hasScroll) {
    prevButton.classList.add("is-disabled");
    nextButton.classList.add("is-disabled");
    return;
  }

  // OBS: começo
  prevButton.classList.toggle("is-disabled", track.scrollLeft <= 0);

  // OBS: fim
  nextButton.classList.toggle("is-disabled", track.scrollLeft >= maxScrollLeft - 1);
}
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

    // OBS: envia via EmailJS (envio real)
    emailjs
      .send(
        "service_15pxzla",           // OBS: seu SERVICE_ID
        "template_a8s4n7l",          // OBS: seu TEMPLATE_ID
        {
          from_name: nameValue,      // OBS: nome digitado no form
          from_email: emailValue,    // OBS: email digitado no form
          message: messageValue,     // OBS: mensagem digitada no form
        },
        "ABAnFQNqW_9757-2O"          // OBS: sua PUBLIC KEY
      )
      .then(() => {
        setFeedback("Mensagem enviada com sucesso!", "success");
        form.reset();
      })
      .catch(() => {
        setFeedback("Erro ao enviar. Tente novamente em instantes.", "error");
      });
  
  });
}

/* =========================================================
   REVEAL: animations on scroll (A)
   ========================================================= */

function setupRevealOnScroll() {
  const targets = document.querySelectorAll("section"); // OBS: vamos animar cada section

  // OBS: adiciona classe base (estado inicial) sem mexer no HTML
  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // OBS: quando entra na tela, marca como visível
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // OBS: anima só 1 vez (mais leve)
        }
      });
    },
    {
      threshold: 0.15, // OBS: dispara quando 15% da section aparece
    }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   Init
   ========================================================= */

// OBS: garante que o HTML já carregou antes de rodar JS
document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupCarousel();
  setupContactForm();
  setupRevealOnScroll(); // OBS: ativa animações
});

// OBS: seu usuário do GitHub (troque se necessário)
const GITHUB_USERNAME = "joaolemos01";

// OBS: onde os cards vão ser inseridos
const projectsTrack = document.querySelector(".projects__track");

// OBS: cria HTML seguro e consistente para cada repo
function createProjectCard(repo) {
  const article = document.createElement("article");
  article.className = "project-card";

  // OBS: descrição pode vir vazia no GitHub
  const description = repo.description ? repo.description : "Projeto sem descrição no GitHub.";

  // OBS: homepage (GitHub Pages / site do projeto) pode existir
  const projectUrl = repo.homepage && repo.homepage.trim() !== ""
    ? repo.homepage
    : repo.html_url;

  article.innerHTML = `
    <h3 class="project-card__title">${repo.name}</h3>
    <p class="project-card__text">${description}</p>
    <a class="project-card__link" href="${projectUrl}" target="_blank" rel="noopener noreferrer">
      Ver projeto
    </a>
  `;

  return article;
}

// OBS: renderiza lista de repos na trilha
function renderProjects(repos) {
  projectsTrack.innerHTML = ""; // OBS: limpa antes de inserir

  repos.forEach((repo) => {
    const card = createProjectCard(repo);
    projectsTrack.appendChild(card);
  });
}

// OBS: busca os repos públicos do GitHub
async function loadGitHubProjects() {
  if (!projectsTrack) return;

  // OBS: estado de loading simples
  projectsTrack.innerHTML = `<p style="opacity:.8">Carregando projetos do GitHub...</p>`;

  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();

    // OBS: filtros básicos (remove forks e repos privados não aparecem aqui)
    const filtered = repos
      .filter((repo) => !repo.fork) // OBS: remove forks
      .filter((repo) => repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase()); // OBS: opcional

    // OBS: se não tiver nada, mostra mensagem
    if (filtered.length === 0) {
      projectsTrack.innerHTML = `<p style="opacity:.8">Nenhum projeto público encontrado.</p>`;
      return;
    }

      renderProjects(filtered);

        // OBS: atualiza setas depois que os cards foram inseridos no DOM
        if (typeof updateCarouselUI === "function") {
          requestAnimationFrame(updateCarouselUI);
        } 

  } catch (error) {
    projectsTrack.innerHTML = `<p style="opacity:.8">Não foi possível carregar os projetos agora.</p>`;
  }
}

// OBS: roda quando o HTML já carregou
document.addEventListener("DOMContentLoaded", () => {
  loadGitHubProjects();
});

