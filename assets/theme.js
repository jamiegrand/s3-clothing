      /* Mobile hero "Read more" toggle — expands the card to the full content */
      (function () {
        var card = document.querySelector(".hero-card");
        var btn = card && card.querySelector(".hero-toggle");
        if (!card || !btn) return;
        var label = btn.querySelector(".label");
        btn.addEventListener("click", function () {
          var open = card.classList.toggle("is-open");
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          if (label) label.textContent = open ? "Show less" : "Read more";
        });
      })();
