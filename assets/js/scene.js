(function () {
  "use strict";
  var C_DEEP_NAVY = new THREE.Color("#0d1b2a"),
    C_PRIMARY_ACCENT = new THREE.Color("#7fd8be"),
    C_SLATE_GRAY = new THREE.Color("#475569"),
    C_CORAL = new THREE.Color("#ff6b6b"),
    C_WARM_WHITE = new THREE.Color("#fafaf8"),
    C_MIDNIGHT_BLUE = new THREE.Color("#1b263b");
  var PALETTE = [C_PRIMARY_ACCENT, C_CORAL];
  function pickBlobColorIndex() {
    return Math.random() < 0.35 ? 1 : 0;
  }
  var BG = 0x0d1b2a;
  var canvas = document.getElementById("scene");
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(BG, 1);
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.036);
  var camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.01,
    60,
  );
  camera.position.set(0, 0, 6);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  var dL1 = new THREE.DirectionalLight(0x7fd8be, 2.2);
  dL1.position.set(4, 6, 4);
  scene.add(dL1);
  var dL2 = new THREE.DirectionalLight(0xffffff, 0.7);
  dL2.position.set(-5, -2, 2);
  scene.add(dL2);
  var dL3 = new THREE.DirectionalLight(0xff6b6b, 0.3);
  dL3.position.set(0, -6, 0);
  scene.add(dL3);
  function createBabyOctopusGeometry(
    size,
    radialSegments,
    heightSegments,
    tentacleCount,
  ) {
    var geo = new THREE.SphereGeometry(
      size,
      Math.max(6, radialSegments || 8),
      Math.max(5, heightSegments || 6),
    );
    var pos = geo.attributes.position;
    var v = new THREE.Vector3();
    var tentacles = Math.max(4, tentacleCount || 6);

    for (var i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      var ny = v.y / size;

      // Keep a rounded head and shape the lower half into soft tentacle lobes.
      if (ny > 0) {
        v.y *= 1.22;
        v.x *= 0.92;
        v.z *= 0.92;
      }

      if (ny < -0.08) {
        var a = Math.atan2(v.z, v.x);
        var lobe = 1 + 0.22 * Math.cos(a * tentacles);
        var depth = Math.min(1, Math.max(0, (-ny - 0.08) / 0.92));
        var flare = 1 + (lobe - 1) * depth;
        v.x *= flare;
        v.z *= flare;
        v.y -= size * 0.34 * depth * depth;
      } else if (ny < 0.15) {
        v.x *= 0.94;
        v.z *= 0.94;
      }

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }
  var N = 1400;
  var geoMain = createBabyOctopusGeometry(0.028, 7, 6, 6);
  var matMain = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.11,
  });
  var meshMain = new THREE.InstancedMesh(geoMain, matMain, N);
  meshMain.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(meshMain);
  var curr = Array.from({ length: N }, function () {
    return new THREE.Vector3();
  });
  var rotOff = Array.from({ length: N }, function () {
    return [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28];
  });
  var phases = Array.from({ length: N }, function () {
    return Math.random();
  });
  var spin = Array.from({ length: N }, function () {
    return 0.6 + Math.random() * 1.4;
  });
  var jiggleAmp = Array.from({ length: N }, function () {
    return 0.012 + Math.random() * 0.022;
  });
  var jiggleFreq = Array.from({ length: N }, function () {
    return 0.9 + Math.random() * 1.8;
  });
  var colorIdx = Array.from({ length: N }, function () {
    return pickBlobColorIndex();
  });
  var N_BG = 157;
  var geoBg = createBabyOctopusGeometry(0.11, 8, 7, 6);
  var matBg = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  var meshBg = new THREE.InstancedMesh(geoBg, matBg, N_BG);
  meshBg.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(meshBg);
  var bgPos = Array.from({ length: N_BG }, function () {
    return new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 11,
      -2.5 + Math.random() * 3,
    );
  });
  var bgRot = Array.from({ length: N_BG }, function () {
    return [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28];
  });
  var bgSpn = Array.from({ length: N_BG }, function () {
    return (Math.random() - 0.5) * 0.8 + (Math.random() > 0.5 ? 0.4 : -0.4);
  });
  var bgPhase = Array.from({ length: N_BG }, function () {
    return Math.random() * Math.PI * 2;
  });
  var bgOrbit = Array.from({ length: N_BG }, function () {
    return 0.35 + Math.random() * 0.9;
  });
  var bgLift = Array.from({ length: N_BG }, function () {
    return 0.18 + Math.random() * 0.55;
  });
  var bgDepth = Array.from({ length: N_BG }, function () {
    return 0.12 + Math.random() * 0.45;
  });
  var bgScaleBase = Array.from({ length: N_BG }, function () {
    // power distribution: many small blobs (matching main particles), fewer large
    return 0.18 + Math.pow(Math.random(), 1.8) * 1.62;
  });
  var bgScalePulse = Array.from({ length: N_BG }, function (_, i) {
    return bgScaleBase[i] * (0.04 + Math.random() * 0.1);
  });
  var bgColorIdx = Array.from({ length: N_BG }, function () {
    return pickBlobColorIndex();
  });
  function genLogoApprox(n) {
    var P = [];
    for (var i = 0; i < n; i++) {
      var r = Math.random();
      if (r < 0.08) {
        var a = Math.random() * Math.PI * 2,
          rad = Math.sqrt(Math.random()) * 0.14;
        P.push(
          new THREE.Vector3(
            -0.24 + rad * Math.cos(a),
            0.6 + rad * Math.sin(a),
            (Math.random() - 0.5) * 0.2,
          ),
        );
      } else if (r < 0.16) {
        var a = Math.random() * Math.PI * 2,
          rad = Math.sqrt(Math.random()) * 0.14;
        P.push(
          new THREE.Vector3(
            0.24 + rad * Math.cos(a),
            0.6 + rad * Math.sin(a),
            (Math.random() - 0.5) * 0.2,
          ),
        );
      } else if (r < 0.5) {
        var t = Math.random(),
          angle = -Math.PI / 2 + t * Math.PI * 1.7,
          px = 0.68 + 0.72 * Math.cos(angle) + (Math.random() - 0.5) * 0.08,
          py = 0.0 + 0.72 * Math.sin(angle) + (Math.random() - 0.5) * 0.08;
        P.push(new THREE.Vector3(px, py, (Math.random() - 0.5) * 0.25));
      } else if (r < 0.82) {
        var t = Math.random(),
          angle = Math.PI * 0.2 + t * Math.PI * 1.7,
          px = -0.68 + 0.72 * Math.cos(angle) + (Math.random() - 0.5) * 0.08,
          py = 0.0 + 0.72 * Math.sin(angle) + (Math.random() - 0.5) * 0.08;
        P.push(new THREE.Vector3(px, py, (Math.random() - 0.5) * 0.25));
      } else {
        var t = Math.random(),
          angle = Math.PI + t * Math.PI * 1.3,
          px = 0.28 + 0.55 * Math.cos(angle) + (Math.random() - 0.5) * 0.08,
          py = -0.55 + 0.55 * Math.sin(angle) + (Math.random() - 0.5) * 0.08;
        P.push(new THREE.Vector3(px, py, (Math.random() - 0.5) * 0.25));
      }
    }
    return P;
  }
  function genGalaxy(n) {
    var P = [];
    var arms = 3; // 3 tight spiral arms like the reference
    for (var i = 0; i < n; i++) {
      var rr = Math.random();
      var x, y, z;
      if (rr < 0.18) {
        // Dense bright core — tight gaussian cluster
        var angle = Math.random() * Math.PI * 2;
        var r = Math.pow(Math.random(), 0.35) * 0.22;
        x = r * Math.cos(angle);
        y = r * Math.sin(angle);
        z = (Math.random() - 0.5) * 0.06 * (1 - r / 0.22);
      } else if (rr < 0.82) {
        // Spiral arms — logarithmic spiral, tightly wound
        var arm = Math.floor(Math.random() * arms);
        var t = Math.pow(Math.random(), 0.6); // bias toward outer
        var r = 0.18 + t * 1.38;
        var armAngle = (arm / arms) * Math.PI * 2;
        // Winding: ~2.8 * PI over full radius (tight coil)
        var wind = r * 2.2;
        var spreadMax = 0.08 + t * 0.13; // arms widen toward edges
        var spread = (Math.random() - 0.5) * spreadMax * 2;
        var theta = armAngle + wind + spread;
        // Arm sub-structure: denser inner ridge + fade
        var ridgeBias = Math.abs(spread) / spreadMax;
        var density = 1.0 - ridgeBias * 0.55;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        // Very flat disc; slight warp at edges
        z = (Math.random() - 0.5) * (0.04 + t * 0.09);
        // Apply density — skip low-density edge particles
        if (Math.random() > density) {
          // Redraw as outer halo scatter instead
          var hr = 0.9 + Math.random() * 0.75;
          var ha = Math.random() * Math.PI * 2;
          x = hr * Math.cos(ha);
          y = hr * Math.sin(ha);
          z = (Math.random() - 0.5) * 0.18;
        }
      } else {
        // Outer halo — scattered individual stars
        var r = 1.15 + Math.pow(Math.random(), 0.7) * 0.85;
        var angle = Math.random() * Math.PI * 2;
        x = r * Math.cos(angle) * (0.85 + Math.random() * 0.3);
        y = r * Math.sin(angle) * (0.85 + Math.random() * 0.3);
        z = (Math.random() - 0.5) * 0.22;
      }
      // Side-on presentation with a diagonal roll so it reads as tilted.
      var incl = 1.02;
      var roll = -0.36;
      var yi = y * Math.cos(incl) - z * Math.sin(incl);
      var zi = y * Math.sin(incl) + z * Math.cos(incl);
      var xr = x * Math.cos(roll) - yi * Math.sin(roll);
      var yr = x * Math.sin(roll) + yi * Math.cos(roll);
      P.push(new THREE.Vector3(xr * 1.28, yr * 0.98, zi * 0.95));
    }
    return P;
  }
  function genGlobe(n) {
    var P = [];
    var R = 1.62;
    for (var i = 0; i < n; i++) {
      var u = Math.random() * 2 - 1;
      var a = Math.random() * Math.PI * 2;
      var s = Math.sqrt(Math.max(0.0001, 1 - u * u));
      var dx = s * Math.cos(a);
      var dy = u;
      var dz = s * Math.sin(a);

      if (Math.random() < 0.74) {
        // Dense shell for a stronger outline.
        var shellR = R + (Math.random() - 0.5) * 0.04;
        P.push(new THREE.Vector3(dx * shellR, dy * shellR, dz * shellR));
      } else {
        // Sparse interior so it reads as a solid sphere with lighter center.
        var innerR = R * (0.18 + Math.pow(Math.random(), 0.55) * 0.72);
        P.push(new THREE.Vector3(dx * innerR, dy * innerR, dz * innerR));
      }
    }
    return P;
  }
  function genDisperse(n) {
    var P = [];
    for (var i = 0; i < n; i++) {
      if (Math.random() < 0.28) {
        P.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            2.0 + Math.random() * 3.5,
          ),
        );
      } else {
        var phi = Math.acos(2 * Math.random() - 1),
          theta = Math.random() * Math.PI * 2,
          r = 4 + Math.random() * 7;
        P.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta) * 0.46,
            r * Math.sin(phi) * Math.sin(theta) * 0.46,
            r * Math.cos(phi) * 0.3,
          ),
        );
      }
    }
    return P;
  }
  function genExplode(n) {
    var P = [];
    for (var i = 0; i < n; i++) {
      if (Math.random() < 0.34) {
        // Forward burst that stays inside view bounds.
        var a = Math.random() * Math.PI * 2;
        var rr = 1.8 + Math.random() * 2.6;
        var zf = 1.4 + Math.random() * 3.0;
        P.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, zf));
      } else {
        // Match pre-globe dispersed footprint (similar scale to D2).
        var phi = Math.acos(2 * Math.random() - 1);
        var theta = Math.random() * Math.PI * 2;
        var r = 3.8 + Math.random() * 6.4;
        P.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta) * 0.45,
            r * Math.sin(phi) * Math.sin(theta) * 0.45,
            r * Math.cos(phi) * 0.28,
          ),
        );
      }
    }
    return P;
  }
  var LOGO = genLogoApprox(N);
  var EXPLODE = genExplode(N);
  var GALAXY = genGalaxy(N),
    GLOBE = genGlobe(N);
  var D1 = genDisperse(N),
    D2 = genDisperse(N),
    D3 = genDisperse(N);
  (function loadSVG() {
    var svgStr =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375"><rect width="375" height="375" fill="black"/><path fill="white" d="M 163.378906 100.589844 C 171.96875 100.589844 179.019531 107.53125 179.019531 116.234375 C 179.019531 124.824219 171.96875 131.875 163.378906 131.875 C 154.675781 131.875 147.734375 124.824219 147.734375 116.234375 C 147.734375 107.53125 154.675781 100.589844 163.378906 100.589844 Z"/><path fill="white" d="M 282.117188 158.421875 L 282.117188 111.828125 C 281.789062 60.386719 239.929688 18.75 188.492188 18.75 C 136.832031 18.75 94.863281 60.71875 94.863281 112.378906 L 94.863281 139.695312 L 127.246094 158.421875 L 127.246094 112.378906 C 127.359375 78.671875 154.675781 51.246094 188.492188 51.246094 C 222.199219 51.246094 249.625 78.671875 249.625 112.378906 L 249.625 213.386719 C 249.625 247.972656 277.714844 275.949219 312.300781 275.949219 C 346.886719 275.949219 374.976562 247.972656 374.976562 213.386719 C 374.976562 178.796875 346.886719 150.710938 312.300781 150.710938 C 307.34375 150.710938 302.605469 151.261719 297.980469 152.363281 L 297.980469 186.730469 C 302.277344 184.414062 307.121094 183.09375 312.300781 183.09375 C 328.933594 183.09375 342.480469 196.640625 342.480469 213.386719 C 342.480469 230.019531 328.933594 243.566406 312.300781 243.566406 C 295.667969 243.566406 282.117188 230.019531 282.117188 213.386719 Z"/><path fill="white" d="M 138.59375 221.648438 C 150.488281 216.359375 161.285156 210.519531 172.078125 204.683594 C 163.265625 199.617188 139.144531 185.40625 80.65625 153.242188 C 74.925781 151.589844 68.976562 150.710938 62.699219 150.710938 C 28.113281 150.710938 0.0234375 178.796875 0.0234375 213.386719 C 0.0234375 247.972656 28.113281 275.949219 62.699219 275.949219 C 91.667969 275.949219 116.011719 256.34375 123.171875 229.796875 L 93.761719 213.386719 C 93.761719 230.457031 79.882812 244.449219 62.699219 244.449219 C 45.515625 244.449219 31.636719 230.457031 31.636719 213.386719 C 31.636719 196.203125 45.515625 182.324219 62.699219 182.324219 C 75.808594 185.1875 97.398438 195.210938 138.59375 221.648438 Z"/><path fill="white" d="M 213.605469 100.589844 C 222.308594 100.589844 229.246094 107.53125 229.246094 116.234375 C 229.246094 124.824219 222.308594 131.875 213.605469 131.875 C 204.902344 131.875 197.964844 124.824219 197.964844 116.234375 C 197.964844 107.53125 204.902344 100.589844 213.605469 100.589844 Z"/><path fill="white" d="M 232.882812 223.078125 C 234.203125 210.191406 234.535156 197.964844 234.863281 185.628906 C 226.050781 190.695312 201.820312 204.574219 163.046875 221.867188 C 140.355469 243.234375 136.609375 247.972656 133.417969 253.371094 C 116.121094 283.332031 126.476562 321.664062 156.4375 338.957031 C 186.398438 356.25 224.730469 346.007812 242.023438 316.046875 C 256.453125 291.042969 251.605469 260.089844 232.222656 240.59375 L 203.25 257.886719 C 218.121094 266.367188 223.1875 285.421875 214.597656 300.292969 C 206.003906 315.054688 187.058594 320.230469 172.1875 311.640625 C 157.320312 303.046875 152.253906 284.101562 160.84375 269.230469 C 169.875 259.316406 189.371094 245.660156 232.882812 223.078125 Z"/></svg>';
    var ofc = document.createElement("canvas");
    ofc.width = ofc.height = 400;
    var ctx2 = ofc.getContext("2d");
    var blob = new Blob([svgStr], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function () {
      ctx2.drawImage(img, 0, 0, 400, 400);
      URL.revokeObjectURL(url);
      var data = ctx2.getImageData(0, 0, 400, 400).data;
      var pix = [];
      for (var y = 0; y < 400; y++) {
        for (var x = 0; x < 400; x++) {
          var idx = (y * 400 + x) * 4;
          var alpha = data[idx + 3];
          var luminance = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          if (alpha > 64 && luminance > 28) {
            pix.push([x, y]);
          }
        }
      }
      if (pix.length < 20) return;
      for (var i = 0; i < N; i++) {
        var p = pix[Math.floor(Math.random() * pix.length)];
        LOGO[i].set(
          (p[0] / 400 - 0.5) * 3.8,
          -(p[1] / 400 - 0.5) * 3.8,
          (Math.random() - 0.5) * 0.28,
        );
      }
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  })();
  var STAGES = [
    {
      s: 0.0,
      e: 0.08,
      A: LOGO,
      B: LOGO,
      oxA: 1.8,
      oxB: 1.8,
      oyA: -0.16,
      oyB: -0.16,
    },
    {
      s: 0.08,
      e: 0.18,
      A: LOGO,
      B: LOGO,
      oxA: 1.8,
      oxB: 0.0,
      oyA: -0.16,
      oyB: -0.16,
    },
    {
      s: 0.18,
      e: 0.24,
      A: LOGO,
      B: EXPLODE,
      oxA: 0.0,
      oxB: 0.0,
      oyA: -0.16,
      oyB: 0.0,
      spd: 3.1,
    },
    { s: 0.24, e: 0.3, A: EXPLODE, B: GALAXY, oxA: 0.0, oxB: 0.0, spd: 2.2 },
    { s: 0.3, e: 0.44, A: GALAXY, B: GALAXY, oxA: 0.0, oxB: 0.0 },
    { s: 0.44, e: 0.52, A: GALAXY, B: D2, oxA: 0.0, oxB: 0.0 },
    { s: 0.52, e: 0.65, A: D2, B: GLOBE, oxA: 0.0, oxB: 0.0 },
    { s: 0.65, e: 0.73, A: GLOBE, B: GLOBE, oxA: 0.0, oxB: 0.0 },
    { s: 0.73, e: 0.83, A: GLOBE, B: D3, oxA: 0.0, oxB: 0.0 },
    { s: 0.83, e: 0.94, A: D3, B: LOGO, oxA: 0.0, oxB: 0.0 },
    { s: 0.94, e: 1.0, A: LOGO, B: LOGO, oxA: 0.0, oxB: 0.0 },
  ];
  for (var i = 0; i < N; i++) {
    curr[i].copy(LOGO[i]);
    curr[i].addScaledVector(
      new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize(),
      0.6 + Math.random() * 0.8,
    );
  }
  var _m4 = new THREE.Matrix4(),
    _q = new THREE.Quaternion(),
    _pos = new THREE.Vector3(),
    _scMain = new THREE.Vector3(1, 1, 1),
    _scBg = new THREE.Vector3(1, 1, 1),
    _eu = new THREE.Euler(),
    _col = new THREE.Color(),
    _tgt = new THREE.Vector3(),
    _hoverTargetNdc = new THREE.Vector2(3, 3),
    _hoverNdc = new THREE.Vector2(3, 3),
    _hoverPt = new THREE.Vector3(),
    _hoverRay = new THREE.Vector3();
  function easeIO(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function easeO3(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  var sp = 0;
  window.addEventListener(
    "scroll",
    function () {
      var ms = document.documentElement.scrollHeight - window.innerHeight;
      sp = ms > 0 ? window.scrollY / ms : 0;
    },
    { passive: true },
  );
  var hoverOn = false,
    hoverMix = 0,
    hoverRadius = 0.95,
    hoverRadiusSq = hoverRadius * hoverRadius,
    hoverLift = 0.62,
    hoverPull = 0.08,
    hoverScale = 0.34;
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType && e.pointerType !== "mouse") return;
    _hoverTargetNdc.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
    hoverOn = true;
  });
  canvas.addEventListener("pointerleave", function () {
    hoverOn = false;
  });
  window.addEventListener("blur", function () {
    hoverOn = false;
  });
  function tick(t) {
    requestAnimationFrame(tick);
    var sec = t * 0.001;
    var stageIdx = STAGES.length - 1,
      prog = 1;
    for (var i = 0; i < STAGES.length; i++) {
      if (sp >= STAGES[i].s && sp < STAGES[i].e) {
        stageIdx = i;
        prog = (sp - STAGES[i].s) / (STAGES[i].e - STAGES[i].s);
        break;
      }
    }
    var stage = STAGES[stageIdx],
      ep = easeIO(prog);
    var hoverShapeActive =
      stage.A === stage.B &&
      (stage.A === LOGO || stage.A === GALAXY || stage.A === GLOBE);
    hoverMix += ((hoverOn && hoverShapeActive ? 1 : 0) - hoverMix) * 0.12;
    if (hoverMix > 0.001) {
      _hoverNdc.lerp(_hoverTargetNdc, 0.24);
      _hoverPt.set(_hoverNdc.x, _hoverNdc.y, 0.5).unproject(camera);
      _hoverRay.copy(_hoverPt).sub(camera.position);
      if (Math.abs(_hoverRay.z) > 1e-5) {
        var tHit = -camera.position.z / _hoverRay.z;
        _hoverPt.copy(camera.position).addScaledVector(_hoverRay, tHit);
      }
    }
    var ox = stage.oxA + (stage.oxB - stage.oxA) * ep;
    var oy = (stage.oyA || 0) + ((stage.oyB || 0) - (stage.oyA || 0)) * ep;
    var gRotY = 0,
      gScale = 1.0;
    if (stageIdx === 0) {
      gRotY = 0;
      gScale = 1.4;
    } else if (stageIdx === 1) {
      gRotY = ep * Math.PI * 2;
      gScale = 1.4 - ep * 0.4;
    }
    var cosR = Math.cos(gRotY),
      sinR = Math.sin(gRotY);
    for (var i = 0; i < N; i++) {
      var ph = phases[i],
        localP = Math.max(0, Math.min(1, (prog - ph * 0.16) / 0.84)),
        lp = easeO3(localP);
      _tgt.lerpVectors(stage.A[i], stage.B[i], lp);
      curr[i].lerp(
        _tgt,
        Math.min(0.28, (0.048 + ph * 0.022) * (stage.spd || 1)),
      );
      var rx = curr[i].x * cosR - curr[i].z * sinR,
        rz = curr[i].x * sinR + curr[i].z * cosR;
      _pos.set(
        rx * gScale +
          ox +
          Math.sin(sec * jiggleFreq[i] + ph * 7.3) * jiggleAmp[i],
        curr[i].y * gScale +
          oy +
          Math.cos(sec * jiggleFreq[i] * 1.3 + ph * 4.1) * jiggleAmp[i],
        rz * gScale +
          Math.sin(sec * jiggleFreq[i] * 0.8 + ph * 5.7) * jiggleAmp[i],
      );
      var blobScale = 1;
      if (hoverMix > 0.001) {
        var hx = _pos.x - _hoverPt.x;
        var hy = _pos.y - _hoverPt.y;
        var hd2 = hx * hx + hy * hy;
        if (hd2 < hoverRadiusSq) {
          var h = 1 - Math.sqrt(hd2) / hoverRadius;
          h = h * h * (3 - 2 * h);
          _pos.z += h * hoverMix * hoverLift;
          _pos.x -= hx * h * hoverMix * hoverPull;
          _pos.y -= hy * h * hoverMix * hoverPull;
          blobScale += h * hoverMix * hoverScale;
        }
      }
      _eu.set(
        rotOff[i][0] + sec * spin[i] * 0.38,
        rotOff[i][1] + sec * spin[i] * 0.28,
        rotOff[i][2] + sec * spin[i] * 0.16,
      );
      _q.setFromEuler(_eu);
      _scMain.setScalar(blobScale);
      _m4.compose(_pos, _q, _scMain);
      meshMain.setMatrixAt(i, _m4);
      var base = PALETTE[colorIdx[i]],
        dist = curr[i].length(),
        brt = Math.max(0.72, 1.0 - dist * 0.02),
        pulse = 0.88 + 0.12 * Math.sin(sec * 0.28 + ph * 5.1);
      _col.copy(base).multiplyScalar(brt * pulse);
      meshMain.setColorAt(i, _col);
    }
    meshMain.instanceMatrix.needsUpdate = true;
    if (meshMain.instanceColor) meshMain.instanceColor.needsUpdate = true;
    for (var i = 0; i < N_BG; i++) {
      var ph = bgPhase[i];
      var spd = Math.abs(bgSpn[i]) + 0.18;
      var swirl = sec * spd;
      var dx =
        bgPos[i].x +
        Math.cos(swirl + ph) * bgOrbit[i] +
        Math.sin(swirl * 0.47 + ph * 0.6) * 0.45;
      var dy =
        bgPos[i].y +
        Math.sin(swirl * 1.1 + ph) * bgLift[i] +
        Math.cos(swirl * 0.37 + ph) * 0.18;
      var dz =
        bgPos[i].z +
        Math.cos(swirl * 0.8 + ph) * bgDepth[i] +
        Math.sin(sec * 0.14 + ph * 0.4) * 0.22;
      _pos.set(dx, dy, dz);
      _eu.set(
        bgRot[i][0] + sec * bgSpn[i] * 1.6,
        bgRot[i][1] + sec * bgSpn[i] * 1.1 + Math.sin(swirl + ph) * 0.25,
        bgRot[i][2] + sec * bgSpn[i] * 0.85,
      );
      var bgScale =
        bgScaleBase[i] + Math.sin(swirl * 1.8 + ph) * bgScalePulse[i];
      _scBg.setScalar(Math.max(0.12, bgScale));
      _q.setFromEuler(_eu);
      _m4.compose(_pos, _q, _scBg);
      meshBg.setMatrixAt(i, _m4);
      var bgBase = PALETTE[bgColorIdx[i]];
      var bgPulse = 0.78 + 0.22 * Math.sin(swirl * 0.8 + ph * 1.4);
      _col.copy(bgBase).multiplyScalar(bgPulse);
      meshBg.setColorAt(i, _col);
    }
    meshBg.instanceMatrix.needsUpdate = true;
    if (meshBg.instanceColor) meshBg.instanceColor.needsUpdate = true;
    matBg.opacity = 0.05 + 0.02 * Math.sin(sec * 0.34);
    renderer.render(scene, camera);
  }
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  requestAnimationFrame(tick);
})();
