/* ===== NAV: Active on click ===== */
const navLinks = document.querySelectorAll(".nav__link");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // Remove "active" de todos
    navLinks.forEach((item) => item.classList.remove("active"));

    // Adiciona "active" no clicado
    this.classList.add("active");
  });
});

/* ===== HEADER: used by scroll spy + shadow ===== */
// Precisa ser declarado antes do scroll spy usar header.offsetHeight
const header = document.querySelector(".header");

/* ===== HEADER SHADOW ===== */
window.addEventListener("scroll", () => {
  // Se rolou mais que 50px, aplica sombra
  if (window.scrollY > 50) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

/* ===== SCROLL SPY: Active link while scrolling ===== */
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let currentSection = "";

  const headerHeight = header.offsetHeight; // lê a altura real do header fixo

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;       // posição da section na página
    const sectionHeight = section.clientHeight; // altura da section

    // Considera o header fixo para ativar o link na hora certa
    if (window.scrollY >= sectionTop - headerHeight - sectionHeight / 4) {
      currentSection = section.getAttribute("id");
    }
  });

  // Ativa o link correspondente
  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

/* ===== PROJECTS CAROUSEL: arrows + disable ===== */
const track = document.querySelector(".projects__track");
const nextButton = document.querySelector(".projects__next");
const prevButton = document.querySelector(".projects__prev");

const scrollAmount = 300; // pixels por clique

function updateCarouselButtons() {
  // Segurança: evita erro se não existir carrossel
  if (!track || !nextButton || !prevButton) return;

  const maxScrollLeft = track.scrollWidth - track.clientWidth;

  // Desabilita esquerda no começo
  if (track.scrollLeft <= 0) prevButton.classList.add("is-disabled");
  else prevButton.classList.remove("is-disabled");

  // Desabilita direita no fim
  if (track.scrollLeft >= maxScrollLeft - 1) nextButton.classList.add("is-disabled");
  else nextButton.classList.remove("is-disabled");
}

// Direita
nextButton.addEventListener("click", () => {
  track.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

// Esquerda
prevButton.addEventListener("click", () => {
  track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

// Atualiza ao rolar manualmente o carrossel
track.addEventListener("scroll", updateCarouselButtons);

// Atualiza ao carregar e ao redimensionar
function updateCarouselButtons() {
  // Segurança: evita erro se não existir carrossel
  if (!track || !nextButton || !prevButton) return;

  const maxScrollLeft = track.scrollWidth - track.clientWidth; // quanto dá pra rolar no total

  // ✅ Se não existe scroll (tudo cabe na tela), esconde as duas setas
  if (maxScrollLeft <= 0) {
    prevButton.classList.add("is-disabled");
    nextButton.classList.add("is-disabled");
    return; // sai da função
  }

  const threshold = 5; // margem para evitar piscar (principalmente em tela dividida)

  // Começo
  if (track.scrollLeft <= threshold) prevButton.classList.add("is-disabled");
  else prevButton.classList.remove("is-disabled");

  // Fim
  if (track.scrollLeft >= maxScrollLeft - threshold) nextButton.classList.add("is-disabled");
  else nextButton.classList.remove("is-disabled");
  }
// updateCarouselButtons();
track.addEventListener("scroll", updateCarouselButtons);
