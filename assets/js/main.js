/* Kavya Jain Constructions — site behaviour */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation ---------- */

  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll progress bar ---------- */

  var progressBar = null;

  if (!reduceMotion) {
    var progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    progressBar = document.createElement("span");
    progressBar.className = "scroll-progress__bar";
    progress.appendChild(progressBar);
    document.body.appendChild(progress);
  }

  /* ---------- Header: shadow, auto-hide, scroll progress ---------- */

  var header = document.querySelector(".header");
  var lastY = window.scrollY;
  var ticking = false;

  var onScroll = function () {
    var y = window.scrollY;

    if (header) {
      header.classList.toggle("is-stuck", y > 8);

      // Hide going down past the hero, reveal on any upward movement.
      var goingDown = y > lastY;
      var pastHero = y > 320;
      var navOpen = mobileNav && mobileNav.classList.contains("is-open");
      header.classList.toggle("is-hidden", goingDown && pastHero && !navOpen);
    }

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }

    lastY = y;
    ticking = false;
  };

  onScroll();

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );

  /* ---------- Hero video ---------- */

  var heroVideo = document.querySelector(".hero__video");

  if (heroVideo) {
    if (reduceMotion) {
      // Leave the poster frame in place rather than looping motion.
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    } else {
      // Some browsers block autoplay until the metadata is ready.
      var tryPlay = function () {
        var attempt = heroVideo.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {
            /* Autoplay refused — the poster image stands in. */
          });
        }
      };
      if (heroVideo.readyState >= 2) {
        tryPlay();
      } else {
        heroVideo.addEventListener("loadeddata", tryPlay, { once: true });
      }
    }
  }

  /* ---------- Scroll reveal ---------- */

  var revealables = document.querySelectorAll(".reveal");

  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      revealables.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
        observer.observe(el);
      });
    }
  }

  /* ---------- Count-up numbers ---------- */

  var counters = document.querySelectorAll("[data-count]");

  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var start = null;

      var frame = function (now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        // easeOutExpo — fast out of the gate, settles gently on the number
        var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) window.requestAnimationFrame(frame);
      };

      window.requestAnimationFrame(frame);
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        el.textContent =
          parseFloat(el.getAttribute("data-count")).toFixed(decimals) +
          (el.getAttribute("data-suffix") || "");
      });
    } else {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------- FAQ accordion ---------- */

  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) {
        panel.classList.toggle("is-open", !open);
      }
    });
  });

  /* ---------- Project filters ---------- */

  var filterButtons = document.querySelectorAll(".filter");
  var projectGrid = document.getElementById("project-grid");

  if (filterButtons.length && projectGrid) {
    var projects = projectGrid.querySelectorAll(".proj");
    var countEl = document.getElementById("filter-count");
    var emptyEl = document.getElementById("empty-state");

    var applyFilter = function (value) {
      var shown = 0;

      projects.forEach(function (card) {
        var match = value === "all" || card.getAttribute("data-category") === value;
        card.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });

      filterButtons.forEach(function (btn) {
        var active = btn.getAttribute("data-filter") === value;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      if (countEl) {
        countEl.textContent =
          value === "all"
            ? "Showing all " + shown + " projects"
            : "Showing " + shown + (shown === 1 ? " project" : " projects");
      }

      if (emptyEl) emptyEl.hidden = shown !== 0;
    };

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
      });
    });

    var resetBtn = document.querySelector("[data-filter-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        applyFilter("all");
      });
    }
  }

  /* ---------- Current year ---------- */

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Enquiry form ---------- */

  var form = document.getElementById("enquiry-form");

  if (form) {
    var status = document.getElementById("form-status");

    var setError = function (field, message) {
      var wrap = field.closest(".field");
      var slot = wrap ? wrap.querySelector(".field__error") : null;
      if (wrap) wrap.classList.toggle("has-error", Boolean(message));
      if (slot) slot.textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var phone = form.elements.phone;
      var message = form.elements.message;
      var firstInvalid = null;

      var checks = [
        [name, name.value.trim().length >= 2, "Please enter your name."],
        [
          phone,
          /^[0-9+\-\s()]{8,16}$/.test(phone.value.trim()),
          "Please enter a phone number we can reach you on.",
        ],
        [
          message,
          message.value.trim().length >= 10,
          "Tell us a little about the work — at least a sentence.",
        ],
      ];

      checks.forEach(function (check) {
        var field = check[0];
        var valid = check[1];
        setError(field, valid ? "" : check[2]);
        if (!valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // No backend is wired up yet — see README before going live.
      form.hidden = true;
      if (status) {
        status.hidden = false;
        status.textContent =
          "Thanks, " +
          name.value.trim() +
          ". Your enquiry has been recorded on this device only — this form is not yet " +
          "connected to email. Please call 065034 50762 so we can respond today.";
        status.focus();
      }
    });
  }
})();
