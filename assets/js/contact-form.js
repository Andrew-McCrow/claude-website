(function () {
  "use strict";

  var form = document.querySelector(".contact-form");
  if (!form) {
    return;
  }

  function getValue(formData, key) {
    return String(formData.get(key) || "").trim();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    var formData = new FormData(form);

    if (getValue(formData, "_honey") !== "") {
      return;
    }

    var name = getValue(formData, "name");
    var email = getValue(formData, "email");
    var company = getValue(formData, "company") || "Not provided";
    var message = getValue(formData, "message");

    var lines = [
      "New Book Call Request",
      "",
      "Name: " + name,
      "Email: " + email,
      "Company: " + company,
      "",
      "Message:",
      message,
    ];

    var mailto =
      "mailto:hello@asktheoctopus.com?subject=" +
      encodeURIComponent("Book Call Request - Octopus AI") +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    window.location.href = mailto;

    window.setTimeout(function () {
      window.location.href = "success.html";
    }, 900);
  });
})();
