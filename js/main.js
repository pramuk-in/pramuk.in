/* Pramuk Marine & Dive Solutions — main.js */
(function () {
  "use strict";

  /* ---------- Contact email (assembled at runtime to deter scrapers) ---------- */
  var EMAIL_USER = "Admin";
  var EMAIL_DOMAIN = "pramuk.in";
  var CONTACT_EMAIL = EMAIL_USER + "@" + EMAIL_DOMAIN;
  // After the first form submission, FormSubmit emails an activation link to
  // Admin@pramuk.in. Once activated, you may replace CONTACT_EMAIL below with
  // the random alias FormSubmit gives you (e.g. "a1b2c3d4e5") for extra privacy:
  // FORM_ENDPOINT = "https://formsubmit.co/<your-alias>";
  var FORM_ENDPOINT = "https://formsubmit.co/" + CONTACT_EMAIL;

  function renderEmailLink(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var a = document.createElement("a");
    a.href = "mailto:" + CONTACT_EMAIL;
    a.textContent = CONTACT_EMAIL;
    el.appendChild(a);
  }
  renderEmailLink("contact-email");
  renderEmailLink("footer-email");

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  if (lightbox && lightboxImg && typeof lightbox.showModal === "function") {
    document.querySelectorAll(".gallery-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lightboxImg.src = btn.getAttribute("data-full");
        var innerImg = btn.querySelector("img");
        if (innerImg) lightboxImg.alt = innerImg.alt;
        lightbox.showModal();
      });
    });
    lightboxClose.addEventListener("click", function () { lightbox.close(); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Enquiry form: security + validation ---------- */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  // The action URL is attached only after a real user interacts with the
  // form, so naive bots that POST the raw HTML find no endpoint.
  var armed = false;
  function armForm() {
    if (armed) return;
    armed = true;
    form.setAttribute("action", FORM_ENDPOINT);
    var next = document.createElement("input");
    next.type = "hidden";
    next.name = "_next";
    next.value = window.location.origin + "/thank-you";
    form.appendChild(next);
  }
  form.addEventListener("focusin", armForm, { once: true });

  function setError(input, errorSelector, show) {
    var msg = form.querySelector('.field-error[data-for="' + errorSelector + '"]');
    if (msg) msg.classList.toggle("show", show);
    if (input) input.classList.toggle("invalid", show);
    if (input && show) input.setAttribute("aria-invalid", "true");
    if (input && !show) input.removeAttribute("aria-invalid");
  }

  var nameInput = document.getElementById("f-name");
  var emailInput = document.getElementById("f-email");
  var phoneInput = document.getElementById("f-phone");
  var messageInput = document.getElementById("f-message");
  var consentInput = document.getElementById("f-consent");
  var statusEl = document.getElementById("form-status");
  var submitBtn = form.querySelector(".btn-submit");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    var ok = true;
    var firstBad = null;

    var nameVal = nameInput.value.trim();
    var nameBad = nameVal.length < 2 || nameVal.length > 100;
    setError(nameInput, "f-name", nameBad);
    if (nameBad) { ok = false; firstBad = firstBad || nameInput; }

    var emailVal = emailInput.value.trim();
    var emailBad = !EMAIL_RE.test(emailVal) || emailVal.length > 150;
    setError(emailInput, "f-email", emailBad);
    if (emailBad) { ok = false; firstBad = firstBad || emailInput; }

    var digits = phoneInput.value.replace(/[^\d]/g, "");
    var phoneBad = digits.length < 6 || digits.length > 15;
    setError(phoneInput, "f-phone", phoneBad);
    if (phoneBad) { ok = false; firstBad = firstBad || phoneInput; }
    if (!phoneBad) phoneInput.value = digits;

    var msgVal = messageInput.value.trim();
    var msgBad = msgVal.length < 10 || msgVal.length > 2000;
    setError(messageInput, "f-message", msgBad);
    if (msgBad) { ok = false; firstBad = firstBad || messageInput; }

    var consentBad = !consentInput.checked;
    setError(consentInput, "f-consent", consentBad);
    if (consentBad) { ok = false; firstBad = firstBad || consentInput; }

    if (firstBad) firstBad.focus();
    return ok;
  }

  // Keep phone input numeric as the user types.
  phoneInput.addEventListener("input", function () {
    var cleaned = this.value.replace(/[^\d ]/g, "");
    if (cleaned !== this.value) this.value = cleaned;
  });

  form.addEventListener("submit", function (e) {
    // Honeypot tripped — drop silently so bots believe they succeeded.
    var honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value !== "") {
      e.preventDefault();
      return;
    }

    if (!validate()) {
      e.preventDefault();
      statusEl.textContent = "Please correct the highlighted fields and try again.";
      statusEl.className = "form-status err";
      return;
    }

    armForm();
    statusEl.textContent = "Sending your enquiry…";
    statusEl.className = "form-status ok";
    if (submitBtn) submitBtn.disabled = true;
    // Native POST proceeds to FormSubmit over HTTPS, then redirects to /thank-you.
  });
})();
