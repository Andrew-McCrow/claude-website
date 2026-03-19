(function () {
  // -------------------------------------------------------------------------
  // Desktop dropdown — "Use Cases"
  // -------------------------------------------------------------------------
  var dropdown = document.querySelector(".nav-dropdown");
  if (dropdown) {
    var dropdownToggle = dropdown.querySelector(".nav-dropdown-toggle");

    dropdownToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains("open");
      dropdown.classList.toggle("open", !isOpen);
      dropdownToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", function () {
      dropdown.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdown.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

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
