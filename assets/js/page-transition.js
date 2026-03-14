(function () {
  "use strict";

  var TRANSITION_FLAG_KEY = "octopus_page_transition";
  var TRANSITION_STATE_KEY = "octopus_page_transition_state";
  var TRANSITION_PENDING_CLASS = "transition-pending";
  var rootElement = document.documentElement;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    rootElement.classList.remove(TRANSITION_PENDING_CLASS);
    try {
      window.sessionStorage.removeItem(TRANSITION_FLAG_KEY);
      window.sessionStorage.removeItem(TRANSITION_STATE_KEY);
    } catch (error) {
      // Ignore session storage errors.
    }
    return;
  }

  var body = document.body;

  if (!body) {
    return;
  }

  var canvas = document.createElement("canvas");
  canvas.className = "page-transition-canvas";
  canvas.setAttribute("aria-hidden", "true");
  body.appendChild(canvas);

  var context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  var width = 0;
  var height = 0;
  var dpr = 1;
  var inProgress = false;
  var logoPixelPool = [];
  var LOGO_CANVAS_SIZE = 400;
  var TRANSITION_PALETTE = [
    [127, 216, 190],
    [127, 216, 190],
    [127, 216, 190],
    [250, 250, 248],
    [250, 250, 248],
    [255, 107, 107],
    [255, 107, 107],
    [71, 85, 105],
    [127, 216, 190],
    [250, 250, 248],
  ];
  var LOGO_SVG_SOURCE = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375">',
    '<rect width="375" height="375" fill="black"/>',
    '<path fill="white" d="M 163.378906 100.589844 C 171.96875 100.589844 179.019531 107.53125 179.019531 116.234375 C 179.019531 124.824219 171.96875 131.875 163.378906 131.875 C 154.675781 131.875 147.734375 124.824219 147.734375 116.234375 C 147.734375 107.53125 154.675781 100.589844 163.378906 100.589844 Z"/>',
    '<path fill="white" d="M 282.117188 158.421875 L 282.117188 111.828125 C 281.789062 60.386719 239.929688 18.75 188.492188 18.75 C 136.832031 18.75 94.863281 60.71875 94.863281 112.378906 L 94.863281 139.695312 L 127.246094 158.421875 L 127.246094 112.378906 C 127.359375 78.671875 154.675781 51.246094 188.492188 51.246094 C 222.199219 51.246094 249.625 78.671875 249.625 112.378906 L 249.625 213.386719 C 249.625 247.972656 277.714844 275.949219 312.300781 275.949219 C 346.886719 275.949219 374.976562 247.972656 374.976562 213.386719 C 374.976562 178.796875 346.886719 150.710938 312.300781 150.710938 C 307.34375 150.710938 302.605469 151.261719 297.980469 152.363281 L 297.980469 186.730469 C 302.277344 184.414062 307.121094 183.09375 312.300781 183.09375 C 328.933594 183.09375 342.480469 196.640625 342.480469 213.386719 C 342.480469 230.019531 328.933594 243.566406 312.300781 243.566406 C 295.667969 243.566406 282.117188 230.019531 282.117188 213.386719 Z"/>',
    '<path fill="white" d="M 138.59375 221.648438 C 150.488281 216.359375 161.285156 210.519531 172.078125 204.683594 C 163.265625 199.617188 139.144531 185.40625 80.65625 153.242188 C 74.925781 151.589844 68.976562 150.710938 62.699219 150.710938 C 28.113281 150.710938 0.0234375 178.796875 0.0234375 213.386719 C 0.0234375 247.972656 28.113281 275.949219 62.699219 275.949219 C 91.667969 275.949219 116.011719 256.34375 123.171875 229.796875 L 93.761719 213.386719 C 93.761719 230.457031 79.882812 244.449219 62.699219 244.449219 C 45.515625 244.449219 31.636719 230.457031 31.636719 213.386719 C 31.636719 196.203125 45.515625 182.324219 62.699219 182.324219 C 75.808594 185.1875 97.398438 195.210938 138.59375 221.648438 Z"/>',
    '<path fill="white" d="M 213.605469 100.589844 C 222.308594 100.589844 229.246094 107.53125 229.246094 116.234375 C 229.246094 124.824219 222.308594 131.875 213.605469 131.875 C 204.902344 131.875 197.964844 124.824219 197.964844 116.234375 C 197.964844 107.53125 204.902344 100.589844 213.605469 100.589844 Z"/>',
    '<path fill="white" d="M 232.882812 223.078125 C 234.203125 210.191406 234.535156 197.964844 234.863281 185.628906 C 226.050781 190.695312 201.820312 204.574219 163.046875 221.867188 C 140.355469 243.234375 136.609375 247.972656 133.417969 253.371094 C 116.121094 283.332031 126.476562 321.664062 156.4375 338.957031 C 186.398438 356.25 224.730469 346.007812 242.023438 316.046875 C 256.453125 291.042969 251.605469 260.089844 232.222656 240.59375 L 203.25 257.886719 C 218.121094 266.367188 223.1875 285.421875 214.597656 300.292969 C 206.003906 315.054688 187.058594 320.230469 172.1875 311.640625 C 157.320312 303.046875 152.253906 284.101562 160.84375 269.230469 C 169.875 259.316406 189.371094 245.660156 232.882812 223.078125 Z"/>',
    "</svg>",
  ].join("");

  function primeLogoPixelPool() {
    var offscreen = document.createElement("canvas");
    offscreen.width = LOGO_CANVAS_SIZE;
    offscreen.height = LOGO_CANVAS_SIZE;

    var offscreenContext = offscreen.getContext("2d");
    if (!offscreenContext) {
      return;
    }

    var blob = new Blob([LOGO_SVG_SOURCE], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var image = new Image();

    image.onload = function () {
      offscreenContext.clearRect(0, 0, LOGO_CANVAS_SIZE, LOGO_CANVAS_SIZE);
      offscreenContext.drawImage(
        image,
        0,
        0,
        LOGO_CANVAS_SIZE,
        LOGO_CANVAS_SIZE,
      );
      URL.revokeObjectURL(url);

      var data = offscreenContext.getImageData(
        0,
        0,
        LOGO_CANVAS_SIZE,
        LOGO_CANVAS_SIZE,
      ).data;
      var pixels = [];

      for (var y = 0; y < LOGO_CANVAS_SIZE; y++) {
        for (var x = 0; x < LOGO_CANVAS_SIZE; x++) {
          var idx = (y * LOGO_CANVAS_SIZE + x) * 4;
          var alpha = data[idx + 3];
          var luminance = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

          if (alpha > 64 && luminance > 28) {
            pixels.push([x, y]);
          }
        }
      }

      if (pixels.length > 20) {
        logoPixelPool = pixels;
      }
    };

    image.onerror = function () {
      URL.revokeObjectURL(url);
    };

    image.src = url;
  }

  function setCanvasSize() {
    width = Math.max(1, window.innerWidth || 1);
    height = Math.max(1, window.innerHeight || 1);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);
  primeLogoPixelPool();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function randomOuterPoint() {
    var pad = 110;
    var side = Math.floor(Math.random() * 4);

    if (side === 0) {
      return {
        x: Math.random() * width,
        y: -pad - Math.random() * 80,
      };
    }

    if (side === 1) {
      return {
        x: width + pad + Math.random() * 80,
        y: Math.random() * height,
      };
    }

    if (side === 2) {
      return {
        x: Math.random() * width,
        y: height + pad + Math.random() * 80,
      };
    }

    return {
      x: -pad - Math.random() * 80,
      y: Math.random() * height,
    };
  }

  function projectOutwardPoint(startX, startY, phase, spread) {
    var centerX = width * 0.5;
    var centerY = height * 0.48;
    var vx = startX - centerX;
    var vy = startY - centerY;
    var len = Math.sqrt(vx * vx + vy * vy);

    if (len < 0.001) {
      vx = Math.cos(phase);
      vy = Math.sin(phase);
      len = 1;
    }

    vx /= len;
    vy /= len;

    var travel = Math.max(width, height) * (0.6 + spread * 0.35);

    return {
      x: startX + vx * travel + Math.cos(phase * 1.7) * 42,
      y: startY + vy * travel + Math.sin(phase * 1.3) * 42,
    };
  }

  function generateApproxLogoPoints(count) {
    var points = [];
    var scale = Math.min(width, height) * 0.175;
    var centerX = width * 0.5;
    var centerY = height * 0.48;

    for (var i = 0; i < count; i++) {
      var roll = Math.random();
      var px = 0;
      var py = 0;

      if (roll < 0.08) {
        var eyeLeftAngle = Math.random() * Math.PI * 2;
        var eyeLeftRadius = Math.sqrt(Math.random()) * 0.14;
        px = -0.24 + eyeLeftRadius * Math.cos(eyeLeftAngle);
        py = 0.6 + eyeLeftRadius * Math.sin(eyeLeftAngle);
      } else if (roll < 0.16) {
        var eyeRightAngle = Math.random() * Math.PI * 2;
        var eyeRightRadius = Math.sqrt(Math.random()) * 0.14;
        px = 0.24 + eyeRightRadius * Math.cos(eyeRightAngle);
        py = 0.6 + eyeRightRadius * Math.sin(eyeRightAngle);
      } else if (roll < 0.5) {
        var tRight = Math.random();
        var angleRight = -Math.PI / 2 + tRight * Math.PI * 1.7;
        px = 0.68 + 0.72 * Math.cos(angleRight) + (Math.random() - 0.5) * 0.08;
        py = 0.0 + 0.72 * Math.sin(angleRight) + (Math.random() - 0.5) * 0.08;
      } else if (roll < 0.82) {
        var tLeft = Math.random();
        var angleLeft = Math.PI * 0.2 + tLeft * Math.PI * 1.7;
        px = -0.68 + 0.72 * Math.cos(angleLeft) + (Math.random() - 0.5) * 0.08;
        py = 0.0 + 0.72 * Math.sin(angleLeft) + (Math.random() - 0.5) * 0.08;
      } else {
        var tBottom = Math.random();
        var angleBottom = Math.PI + tBottom * Math.PI * 1.3;
        px = 0.28 + 0.55 * Math.cos(angleBottom) + (Math.random() - 0.5) * 0.08;
        py =
          -0.55 + 0.55 * Math.sin(angleBottom) + (Math.random() - 0.5) * 0.08;
      }

      points.push({
        x: centerX + px * scale,
        y: centerY - py * scale,
      });
    }

    return points;
  }

  function generateLogoPoints(count) {
    if (logoPixelPool.length < 20) {
      return generateApproxLogoPoints(count);
    }

    var points = [];
    var scale = Math.min(width, height) * 0.17;
    var centerX = width * 0.5;
    var centerY = height * 0.48;
    var totalPixels = logoPixelPool.length;
    var startIndex = Math.floor(Math.random() * totalPixels);
    var stride = Math.max(1, Math.floor(totalPixels / count));
    var jitterWindow = Math.max(1, Math.floor(stride * 0.75));

    for (var i = 0; i < count; i++) {
      var sampleIndex =
        (startIndex + i * stride + Math.floor(Math.random() * jitterWindow)) %
        totalPixels;
      var sample = logoPixelPool[sampleIndex];
      var px = (sample[0] / LOGO_CANVAS_SIZE - 0.5) * 3.8;
      var py = -(sample[1] / LOGO_CANVAS_SIZE - 0.5) * 3.8;

      points.push({
        x: centerX + px * scale,
        y: centerY - py * scale,
      });
    }

    return points;
  }

  function buildParticles(mode) {
    var count = clamp(Math.round(Math.min(width, height) * 0.82), 480, 920);

    var targets = generateLogoPoints(count);

    return targets.map(function (target) {
      var phase = Math.random() * Math.PI * 2;
      var drift = 0.45 + Math.random() * 1.05;
      var start = mode === "exit" ? randomOuterPoint() : target;
      var end =
        mode === "exit"
          ? target
          : projectOutwardPoint(start.x, start.y, phase, drift);

      return {
        sx: start.x,
        sy: start.y,
        ex: end.x,
        ey: end.y,
        size: 2.5 + Math.random() * 3.0,
        colorIndex: Math.floor(Math.random() * TRANSITION_PALETTE.length),
        drift: drift,
        phase: phase,
      };
    });
  }

  function saveExitState(particles) {
    try {
      var payload = particles.map(function (particle) {
        return [
          +(particle.ex / width).toFixed(6),
          +(particle.ey / height).toFixed(6),
          +particle.size.toFixed(4),
          particle.colorIndex | 0,
          +particle.drift.toFixed(4),
          +particle.phase.toFixed(4),
        ];
      });

      window.sessionStorage.setItem(
        TRANSITION_STATE_KEY,
        JSON.stringify(payload),
      );
    } catch (error) {
      // Session storage can be unavailable in some privacy contexts.
    }
  }

  function consumeTransitionState() {
    var raw = null;

    try {
      raw = window.sessionStorage.getItem(TRANSITION_STATE_KEY);
      window.sessionStorage.removeItem(TRANSITION_STATE_KEY);
    } catch (error) {
      return null;
    }

    if (!raw) {
      return null;
    }

    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length < 10) {
        return null;
      }

      return parsed;
    } catch (error) {
      return null;
    }
  }

  function buildParticlesFromStoredState(storedState) {
    return storedState.map(function (entry) {
      var sx = clamp(Number(entry[0]), -1, 2) * width;
      var sy = clamp(Number(entry[1]), -1, 2) * height;
      var size = clamp(Number(entry[2]) || 2.5, 0.5, 6);
      var colorIndex =
        Math.abs(parseInt(entry[3], 10) || 0) % TRANSITION_PALETTE.length;
      var drift = clamp(Number(entry[4]) || 0.7, 0.2, 2.2);
      var phase = Number(entry[5]) || 0;
      var end = projectOutwardPoint(sx, sy, phase, drift);

      return {
        sx: sx,
        sy: sy,
        ex: end.x,
        ey: end.y,
        size: size,
        colorIndex: colorIndex,
        drift: drift,
        phase: phase,
      };
    });
  }

  function colorForIndex(index, alpha) {
    var color = TRANSITION_PALETTE[index % TRANSITION_PALETTE.length];
    return (
      "rgba(" +
      color[0] +
      ", " +
      color[1] +
      ", " +
      color[2] +
      ", " +
      alpha +
      ")"
    );
  }

  // Draw an octopus-shaped blob matching createBabyOctopusGeometry projected to 2D.
  // `angle` rotates the blob around its centre for variety (matches scene.js spin).
  function octopusBlobPath(cx, cy, r, angle) {
    var TENTACLES = 6;
    var STEPS = 24;
    var ca = Math.cos(angle);
    var sa = Math.sin(angle);
    context.beginPath();
    for (var i = 0; i <= STEPS; i++) {
      var a = (i / STEPS) * Math.PI * 2;
      var nx = Math.cos(a);
      var ny = Math.sin(a); // world-space y: +1 = up
      var px, py;
      if (ny > 0) {
        // Top half: narrower width, taller head (mirrors y*=1.22, x/z*=0.92)
        px = nx * 0.92;
        py = ny * 1.22;
      } else if (ny < -0.08) {
        // Bottom half: 6 tentacle lobes + downward shift
        var depth = Math.min(1, (-ny - 0.08) / 0.92);
        var lobe = 1 + 0.22 * Math.cos(a * TENTACLES) * depth;
        px = nx * lobe;
        py = ny * lobe - 0.34 * depth * depth;
      } else {
        // Equator band
        px = nx * 0.94;
        py = ny;
      }
      // Rotate around blob centre then project (canvas y is flipped)
      var rx = px * ca - py * sa;
      var ry = px * sa + py * ca;
      var sx = cx + rx * r;
      var sy = cy - ry * r;
      if (i === 0) context.moveTo(sx, sy);
      else context.lineTo(sx, sy);
    }
    context.closePath();
  }

  function renderFrame(
    particles,
    movementProgress,
    overlayAlpha,
    mode,
    holdLogo,
  ) {
    var eased =
      mode === "exit"
        ? easeOutCubic(movementProgress)
        : easeInOutCubic(movementProgress);
    context.clearRect(0, 0, width, height);

    var clampedOverlayAlpha = clamp(overlayAlpha, 0, 1);
    context.fillStyle = "rgba(13, 27, 42, " + clampedOverlayAlpha + ")";
    context.fillRect(0, 0, width, height);

    var wobbleBase = holdLogo ? 0 : (mode === "exit" ? 1 - eased : eased) * 4.8;
    var now = performance.now() * 0.001; // seconds for continuous spin

    for (var i = 0; i < particles.length; i++) {
      var particle = particles[i];
      var x = lerp(particle.sx, particle.ex, eased);
      var y = lerp(particle.sy, particle.ey, eased);

      x +=
        Math.cos(movementProgress * 14 + particle.phase) *
        wobbleBase *
        particle.drift;
      y +=
        Math.sin(movementProgress * 11 + particle.phase) *
        wobbleBase *
        particle.drift;

      var alpha =
        mode === "exit" ? lerp(0.1, 0.28, eased) : lerp(0.24, 0.05, eased);
      if (holdLogo) {
        alpha = 0.28;
      }

      var radius =
        mode === "exit"
          ? particle.size * (0.76 + eased * 0.38)
          : particle.size * (1.02 - eased * 0.26);
      if (holdLogo) {
        radius = particle.size * 1.06;
      }

      // Wireframe-style: very faint fill, visible stroke (matches scene.js MeshBasicMaterial wireframe)
      var fillAlpha = alpha * 0.06;
      var lineWidth = holdLogo
        ? 0.7
        : mode === "exit"
          ? 0.55 + eased * 0.25
          : 0.5 + (1 - eased) * 0.2;

      // Continuous spin matching scene.js spin rates (0.38/0.28/0.16 multipliers)
      var blobAngle = particle.phase + now * (0.38 + particle.drift * 0.22);

      context.fillStyle = colorForIndex(particle.colorIndex, fillAlpha.toFixed(3));
      context.strokeStyle = colorForIndex(particle.colorIndex, alpha.toFixed(3));
      context.lineWidth = lineWidth;
      octopusBlobPath(x, y, radius, blobAngle);
      context.fill();
      context.stroke();
    }
  }

  function runTransition(mode, onDone) {
    body.classList.add("is-transitioning");

    var storedState = mode === "enter" ? consumeTransitionState() : null;
    var particles =
      mode === "enter" && storedState
        ? buildParticlesFromStoredState(storedState)
        : buildParticles(mode);
    var start = performance.now();
    var EXIT_FORM_DURATION = 500;
    var EXIT_HOLD_DURATION = 300;
    var ENTER_DISPERSE_DURATION = 500;

    if (mode === "enter") {
      canvas.style.transition = "none";
      canvas.style.opacity = "1";
      renderFrame(particles, 0, 1, mode, false);
      window.requestAnimationFrame(function () {
        rootElement.classList.remove(TRANSITION_PENDING_CLASS);
        start = performance.now();
        window.requestAnimationFrame(frame);
      });
      return;
    } else {
      canvas.style.transition = "";
      canvas.style.opacity = "";
    }

    function frame(now) {
      var elapsed = now - start;

      if (mode === "exit") {
        if (elapsed < EXIT_FORM_DURATION) {
          var exitProgress = clamp(elapsed / EXIT_FORM_DURATION, 0, 1);
          var exitOverlay = lerp(0.02, 1.0, easeInOutCubic(exitProgress));
          renderFrame(particles, exitProgress, exitOverlay, mode, false);
          window.requestAnimationFrame(frame);
          return;
        }

        var holdElapsed = elapsed - EXIT_FORM_DURATION;
        if (holdElapsed < EXIT_HOLD_DURATION) {
          renderFrame(particles, 1, 1, mode, true);
          window.requestAnimationFrame(frame);
          return;
        }

        if (typeof onDone === "function") {
          saveExitState(particles);
          onDone();
        }
        return;
      }

      var enterProgress = clamp(elapsed / ENTER_DISPERSE_DURATION, 0, 1);
      var enterOverlay = lerp(1.0, 0.0, easeInOutCubic(enterProgress));
      renderFrame(particles, enterProgress, enterOverlay, mode, false);

      if (enterProgress < 1) {
        window.requestAnimationFrame(frame);
        return;
      }

      body.classList.remove("is-transitioning");
      context.clearRect(0, 0, width, height);
      canvas.style.opacity = "";
      canvas.style.transition = "";

      if (typeof onDone === "function") {
        onDone();
      }

      inProgress = false;
    }

    window.requestAnimationFrame(frame);
  }

  function canNavigateProtocol(protocol) {
    return (
      protocol === "http:" || protocol === "https:" || protocol === "file:"
    );
  }

  function shouldHandleLink(event, link) {
    if (inProgress || event.defaultPrevented) {
      return false;
    }

    if (event.button !== 0) {
      return false;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }

    if (link.target && link.target !== "_self") {
      return false;
    }

    if (link.hasAttribute("download")) {
      return false;
    }

    var rawHref = link.getAttribute("href") || "";
    if (rawHref === "" || rawHref.charAt(0) === "#") {
      return false;
    }

    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) {
      return false;
    }

    var destination;

    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return false;
    }

    if (!canNavigateProtocol(destination.protocol)) {
      return false;
    }

    var isFileProtocol = window.location.protocol === "file:";

    if (isFileProtocol) {
      if (destination.protocol !== "file:") {
        return false;
      }
    } else if (destination.origin !== window.location.origin) {
      return false;
    }

    var samePath =
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search;

    if (samePath && destination.hash) {
      return false;
    }

    if (destination.href === window.location.href) {
      return false;
    }

    return true;
  }

  function navigate(destinationUrl) {
    if (inProgress) {
      return;
    }

    inProgress = true;

    try {
      window.sessionStorage.setItem(TRANSITION_FLAG_KEY, "1");
    } catch (error) {
      // Session storage can be unavailable in some privacy contexts.
    }

    runTransition("exit", function () {
      window.location.href = destinationUrl;
    });
  }

  window.OctopusPageTransition = {
    navigate: navigate,
  };

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest("a[href]");

      if (!link || !shouldHandleLink(event, link)) {
        return;
      }

      event.preventDefault();
      navigate(link.href);
    },
    true,
  );

  var shouldPlayIntro = false;

  try {
    shouldPlayIntro =
      window.sessionStorage.getItem(TRANSITION_FLAG_KEY) === "1";
    window.sessionStorage.removeItem(TRANSITION_FLAG_KEY);
  } catch (error) {
    shouldPlayIntro = false;
  }

  if (shouldPlayIntro) {
    inProgress = true;
    runTransition("enter");
  } else {
    rootElement.classList.remove(TRANSITION_PENDING_CLASS);
    try {
      window.sessionStorage.removeItem(TRANSITION_STATE_KEY);
    } catch (error) {
      // Ignore session storage errors.
    }
  }
})();
