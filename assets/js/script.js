console.log("JS running ✅");

const navLinks = document.querySelectorAll(".nav__link");
console.log("Links found:", navLinks.length);

navLinks.forEach(function(link) {
  link.addEventListener("click", function() {
    console.log("Clicked:", link.getAttribute("href"));

    navLinks.forEach(function(item) {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});
