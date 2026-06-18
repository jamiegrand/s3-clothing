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

/* Collection filter chips — visual toggle only (mockup) */
document.querySelectorAll('.chips').forEach(function (group) {
  group.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('is-active');
  });
});

/* PDP gallery — click a thumb to swap the main image */
document.querySelectorAll('.gallery').forEach(function (g) {
  var main = g.querySelector('.main img');
  g.querySelectorAll('.thumb').forEach(function (t) {
    t.addEventListener('click', function () {
      g.querySelectorAll('.thumb').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
      if (main) main.src = t.querySelector('img').src;
    });
  });
});
/* Variant pickers — single-select highlight (mockup) */
document.querySelectorAll('.swatches, .sizes').forEach(function (group) {
  group.addEventListener('click', function (e) {
    var opt = e.target.closest('.swatch-dot, .size-pill');
    if (!opt || opt.getAttribute('aria-disabled') === 'true') return;
    group.querySelectorAll('.is-active').forEach(function (x) { x.classList.remove('is-active'); });
    opt.classList.add('is-active');
  });
});
/* Accordion */
document.querySelectorAll('.acc-trigger').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.closest('.acc-item');
    var open = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});
/* Quantity stepper */
document.querySelectorAll('.qty').forEach(function (q) {
  var input = q.querySelector('input');
  q.querySelector('.dec').addEventListener('click', function () {
    input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
  });
  q.querySelector('.inc').addEventListener('click', function () {
    input.value = (parseInt(input.value, 10) || 1) + 1;
  });
});
