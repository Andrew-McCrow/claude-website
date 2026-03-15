(function () {
  "use strict";

  var FLAG_KEY = "octopus_page_transition";
  var CLICK_KEY = "octopus_page_transition_click";
  var PENDING_CLASS = "transition-pending";
  var FILL_COLOR = "#0d1b2a";
  var EXIT_DURATION = 520;
  var ENTER_DURATION = 480;

  var rootElement = document.documentElement;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    rootElement.classList.remove(PENDING_CLASS);
    try {
      window.sessionStorage.removeItem(FLAG_KEY);
      window.sessionStorage.removeItem(CLICK_KEY);
    } catch (e) {}
    return;
  }

  var body = document.body;
  if (!body) return;

  var canvas = document.createElement("canvas");
  canvas.className = "page-transition-canvas";
  canvas.setAttribute("aria-hidden", "true");
  body.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var W = 0;
  var H = 0;
  var dpr = 1;
  var inProgress = false;

  // Click origin (normalized 0–1) used to anchor the ink bleed.
  var clickNX = 0.5;
  var clickNY = 0.5;

  function resize() {
    W = Math.max(1, window.innerWidth || 1);
    H = Math.max(1, window.innerHeight || 1);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  // Each drop is an organic blob offset from the click origin.
  // ox/oy are fractions of viewport size; rFactor scales maxR; seed drives shape.
  var INK_DROPS = [
    { ox: 0.00,  oy: 0.00,  rFactor: 1.00, seed: 0.0 },
    { ox: 0.07,  oy: -0.05, rFactor: 0.86, seed: 1.3 },
    { ox: -0.06, oy: 0.08,  rFactor: 0.91, seed: 2.7 },
    { ox: 0.05,  oy: 0.09,  rFactor: 0.80, seed: 4.1 },
    { ox: -0.09, oy: -0.04, rFactor: 0.76, seed: 5.5 },
  ];

  // Organic ink blob: roughly circular with multi-frequency sine perturbations.
  // `seed` gives each drop a distinct silhouette without using Math.random().
  function inkBlobPath(cx, cy, r, seed) {
    var STEPS = 72;
    ctx.beginPath();
    for (var i = 0; i <= STEPS; i++) {
      var a = (i / STEPS) * Math.PI * 2;
      var perturb =
        1 +
        0.13 * Math.sin(a * 3 + seed * 1.7) +
        0.09 * Math.sin(a * 5 + seed * 2.3) +
        0.06 * Math.sin(a * 7 + seed * 0.9) +
        0.04 * Math.sin(a * 11 + seed * 3.1);
      var pr = r * perturb;
      var x = cx + Math.cos(a) * pr;
      var y = cy + Math.sin(a) * pr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function easeInQuart(t) {
    return t * t * t * t;
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Returns the radius needed to guarantee the blob covers the entire screen
  // when centered at (cx, cy) — distance to the farthest corner, padded for
  // the blob's organic perturbations (max perturb ≈ 1.32× r).
  function maxRadiusFrom(cx, cy) {
    var corners = [
      [0, 0],
      [W, 0],
      [0, H],
      [W, H],
    ];
    var max = 0;
    for (var i = 0; i < corners.length; i++) {
      var dx = corners[i][0] - cx;
      var dy = corners[i][1] - cy;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d > max) max = d;
    }
    // Divide by 1.25 (min perturbation multiplier ≈ 0.78) so even the
    // narrowest blob angle still reaches every corner.
    return max / 0.78;
  }

  function renderFrame(progress, mode) {
    var originX = clickNX * W;
    var originY = clickNY * H;

    ctx.clearRect(0, 0, W, H);

    // Hard fill when near full coverage to close any corner gaps.
    var nearFull = mode === "exit" ? progress > 0.93 : progress < 0.07;
    if (nearFull) {
      ctx.fillStyle = FILL_COLOR;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = FILL_COLOR;

    for (var i = 0; i < INK_DROPS.length; i++) {
      var drop = INK_DROPS[i];
      var cx = originX + drop.ox * W;
      var cy = originY + drop.oy * H;
      var maxR = maxRadiusFrom(cx, cy) * drop.rFactor;

      // Stagger: secondary drops lag slightly behind the primary.
      var lag = i === 0 ? 0 : 0.06 * i;
      var localProgress = mode === "exit"
        ? Math.max(0, Math.min(1, (progress - lag) / (1 - lag)))
        : Math.max(0, Math.min(1, (progress - lag) / (1 - lag)));

      var r = mode === "exit"
        ? localProgress * maxR
        : (1 - localProgress) * maxR;

      if (r <= 0) continue;

      inkBlobPath(cx, cy, r, drop.seed);
      ctx.fill();
    }
  }

  function runExit(onDone) {
    body.classList.add("is-transitioning");
    canvas.style.transition = "";
    canvas.style.opacity = "";

    var start = performance.now();

    function frame(now) {
      var t = Math.min((now - start) / EXIT_DURATION, 1);
      renderFrame(easeInQuart(t), "exit");

      if (t < 1) {
        window.requestAnimationFrame(frame);
      } else {
        if (typeof onDone === "function") onDone();
      }
    }

    window.requestAnimationFrame(frame);
  }

  function runEnter() {
    body.classList.add("is-transitioning");
    canvas.style.transition = "none";
    canvas.style.opacity = "1";

    renderFrame(0, "enter");

    window.requestAnimationFrame(function () {
      rootElement.classList.remove(PENDING_CLASS);
      var start = performance.now();

      function frame(now) {
        var t = Math.min((now - start) / ENTER_DURATION, 1);
        renderFrame(easeOutQuart(t), "enter");

        if (t < 1) {
          window.requestAnimationFrame(frame);
        } else {
          body.classList.remove("is-transitioning");
          ctx.clearRect(0, 0, W, H);
          canvas.style.opacity = "";
          canvas.style.transition = "";
          inProgress = false;
        }
      }

      window.requestAnimationFrame(frame);
    });
  }

  function canNavigateProtocol(protocol) {
    return (
      protocol === "http:" || protocol === "https:" || protocol === "file:"
    );
  }

  function shouldHandleLink(event, link) {
    if (inProgress || event.defaultPrevented) return false;
    if (event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;

    var rawHref = link.getAttribute("href") || "";
    if (rawHref === "" || rawHref.charAt(0) === "#") return false;
    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return false;

    var destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (e) {
      return false;
    }

    if (!canNavigateProtocol(destination.protocol)) return false;

    var isFileProtocol = window.location.protocol === "file:";
    if (isFileProtocol) {
      if (destination.protocol !== "file:") return false;
    } else if (destination.origin !== window.location.origin) {
      return false;
    }

    var samePath =
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search;

    if (samePath && destination.hash) return false;
    if (destination.href === window.location.href) return false;

    return true;
  }

  function navigate(destinationUrl, originX, originY) {
    if (inProgress) return;
    inProgress = true;

    // Store normalized click origin so the enter animation on the next page
    // retracts from the same position.
    if (originX !== undefined && originY !== undefined) {
      clickNX = originX / W;
      clickNY = originY / H;
      try {
        window.sessionStorage.setItem(
          CLICK_KEY,
          JSON.stringify([clickNX, clickNY]),
        );
      } catch (e) {}
    }

    try {
      window.sessionStorage.setItem(FLAG_KEY, "1");
    } catch (e) {}

    runExit(function () {
      window.location.href = destinationUrl;
    });
  }

  window.OctopusPageTransition = { navigate: navigate };

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest("a[href]");
      if (!link || !shouldHandleLink(event, link)) return;
      event.preventDefault();
      navigate(link.href, event.clientX, event.clientY);
    },
    true,
  );

  // On page load: check if we arrived via a transition.
  var shouldPlayIntro = false;
  try {
    shouldPlayIntro = window.sessionStorage.getItem(FLAG_KEY) === "1";
    window.sessionStorage.removeItem(FLAG_KEY);
    var storedClick = JSON.parse(
      window.sessionStorage.getItem(CLICK_KEY) || "null",
    );
    window.sessionStorage.removeItem(CLICK_KEY);
    if (storedClick && storedClick.length === 2) {
      clickNX = storedClick[0];
      clickNY = storedClick[1];
    }
  } catch (e) {
    shouldPlayIntro = false;
  }

  if (shouldPlayIntro) {
    inProgress = true;
    runEnter();
  } else {
    rootElement.classList.remove(PENDING_CLASS);
  }
})();
