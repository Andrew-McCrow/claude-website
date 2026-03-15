(function () {
  "use strict";

  var form = document.querySelector(".contact-form");
  if (!form) {
    return;
  }

  var errorEl = document.createElement("p");
  errorEl.className = "form-error";
  form.appendChild(errorEl);

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add("visible");
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }

  function getValue(formData, key) {
    return String(formData.get(key) || "").trim();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    if (!form.reportValidity()) {
      return;
    }

    var formData = new FormData(form);

    if (getValue(formData, "_honey") !== "") {
      return;
    }

    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          if (
            window.OctopusPageTransition &&
            typeof window.OctopusPageTransition.navigate === "function"
          ) {
            window.OctopusPageTransition.navigate("success.html");
          } else {
            window.location.href = "success.html";
          }
        } else {
          return response.json().then(function (data) {
            var msg =
              data && data.errors
                ? data.errors
                    .map(function (e) {
                      return e.message;
                    })
                    .join(", ")
                : "Something went wrong. Please try again.";
            showError(msg);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = "Submit";
            }
          });
        }
      })
      .catch(function () {
        showError(
          "Something went wrong. Please check your connection and try again.",
        );
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
      });
  });
})();
