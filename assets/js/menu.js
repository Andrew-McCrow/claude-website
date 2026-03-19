(function () {
  // -------------------------------------------------------------------------
  // Desktop dropdowns
  // -------------------------------------------------------------------------
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  function closeAllDropdowns() {
    dropdowns.forEach(function (d) {
      d.classList.remove("open");
      d.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains("open");
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", closeAllDropdowns);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });

  // -------------------------------------------------------------------------
  // Mobile hamburger menu
  // -------------------------------------------------------------------------
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) {
    return;
  }

  function setMenuState(isOpen) {
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("open", isOpen);
    mobileMenu.hidden = !isOpen;
    document.body.classList.toggle("menu-open", isOpen);
  }

  menuToggle.addEventListener("click", function () {
    var isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
})();
