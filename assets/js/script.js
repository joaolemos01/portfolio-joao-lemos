// Seleciona o Menu
const navLinks = document.querySelectorAll(".nav__link");
// MENU
navLinks.forEach(link => {
  link.addEventListener("click", function () {
    
    navLinks.forEach(item => item.classList.remove("active"));
    
    this.classList.add("active");
  });
});

// Seleciona todas as sections
const sections = document.querySelectorAll("section");
// Escuta evento de scroll
window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach(section => {
    
    const sectionTop = section.offsetTop;        // posição da section no topo da página
    const sectionHeight = section.clientHeight;  // altura da section
    
    const headerHeight = header.offsetHeight;    // altura do header fixo

    // Ajusta cálculo considerando o header fixo
    if (window.scrollY >= sectionTop - headerHeight - sectionHeight / 4) {
      currentSection = section.getAttribute("id");
    }

  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// Seleciona o header
const header = document.querySelector(".header");
// Escuta evento de scroll
window.addEventListener("scroll", function () {
  
  // Se a página estiver rolada mais que 50px
  if (window.scrollY > 50) {
    header.classList.add("scrolled");  // adiciona classe
  } else {
    header.classList.remove("scrolled"); // remove classe
  }

});
