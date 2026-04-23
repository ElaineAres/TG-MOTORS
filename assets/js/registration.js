document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-registration-form]");
  if (!form) return;

  const serviceInputs = Array.from(form.querySelectorAll('input[name="service"]'));
  const phoneInput = form.querySelector('input[name="phone"]');
  const emailInput = form.querySelector('input[name="email"]');
  const successPanel = document.querySelector("[data-registration-success]");
  const resetButton = document.querySelector("[data-registration-reset]");
  const errorNodes = {
    service: form.querySelector('[data-error-for="service"]'),
    contact: form.querySelector('[data-error-for="contact"]'),
  };

  const contactFields = [phoneInput, emailInput].filter(Boolean);

  const clearError = (key) => {
    const node = errorNodes[key];
    if (!node) return;
    node.textContent = "";
    node.classList.remove("is-visible");
  };

  const setError = (key, message) => {
    const node = errorNodes[key];
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
  };

  const setInvalidState = (inputs, invalid) => {
    inputs.forEach((input) => {
      if (!input) return;
      input.classList.toggle("is-invalid", invalid);
      input.setAttribute("aria-invalid", invalid ? "true" : "false");
    });
  };

  const hasSelectedService = () => serviceInputs.some((input) => input.checked);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => value.replace(/[^\d+]/g, "").length >= 8;

  const validateForm = () => {
    let isValid = true;
    const phoneValue = phoneInput ? phoneInput.value.trim() : "";
    const emailValue = emailInput ? emailInput.value.trim() : "";

    clearError("service");
    clearError("contact");
    setInvalidState(contactFields, false);

    if (!hasSelectedService()) {
      setError("service", "Pasirinkite paslaugos tipą.");
      isValid = false;
    }

    if (!phoneValue && !emailValue) {
      setError("contact", "Įveskite telefono numerį arba el. paštą.");
      setInvalidState(contactFields, true);
      isValid = false;
    } else {
      if (phoneValue && !isValidPhone(phoneValue)) {
        setError("contact", "Patikrinkite telefono numerį.");
        if (phoneInput) setInvalidState([phoneInput], true);
        isValid = false;
      }

      if (emailValue && !isValidEmail(emailValue)) {
        setError("contact", "Patikrinkite el. pašto adresą.");
        if (emailInput) setInvalidState([emailInput], true);
        isValid = false;
      }
    }

    return isValid;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    form.hidden = true;
    if (successPanel) {
      successPanel.hidden = false;
      successPanel.focus();
      successPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  serviceInputs.forEach((input) => {
    input.addEventListener("change", () => clearError("service"));
  });

  contactFields.forEach((input) => {
    input.addEventListener("input", () => {
      clearError("contact");
      setInvalidState(contactFields, false);
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      if (successPanel) {
        successPanel.hidden = true;
      }
      clearError("service");
      clearError("contact");
      setInvalidState(contactFields, false);
      const firstService = serviceInputs[0];
      if (firstService) {
        firstService.focus();
      }
    });
  }
});
