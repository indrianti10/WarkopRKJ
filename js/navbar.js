fetch('navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;

    // ACTIVE MENU
    const currentPage = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link, .dropdown-item").forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add("active");

        const dropdown = link.closest(".dropdown");
        if (dropdown) {
          dropdown.querySelector(".nav-link").classList.add("active");
        }
      }
    });

    // SCROLL EFFECT
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  });

  fetch("footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer").innerHTML = html;
  });
