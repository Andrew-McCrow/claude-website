(function () {
  "use strict";
  var C_PRIMARY_ACCENT = new THREE.Color("#7fd8be");
  var C_CORAL = new THREE.Color("#ff6b6b");
  var PALETTE = [C_PRIMARY_ACCENT, C_CORAL];
  function pickBlobColorIndex() {
    return Math.random() < 0.35 ? 1 : 0;
  }
  var BG = 0x0d1b2a;
  var canvas = document.getElementById("scene");
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(BG, 1);
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.036);
  var camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.01,
    60
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

  function createBlobGeometry(size, radialSegments, heightSegments, tentacleCount) {
    var geo = new THREE.SphereGeometry(
      size,
      Math.max(6, radialSegments || 8),
      Math.max(5, heightSegments || 6)
    );
    var pos = geo.attributes.position;
    var v = new THREE.Vector3();
    var tentacles = Math.max(4, tentacleCount || 6);
    for (var i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      var ny = v.y / size;
      if (ny > 0) { v.y *= 1.22; v.x *= 0.92; v.z *= 0.92; }
      if (ny < -0.08) {
        var a = Math.atan2(v.z, v.x);
        var lobe = 1 + 0.22 * Math.cos(a * tentacles);
        var depth = Math.min(1, Math.max(0, (-ny - 0.08) / 0.92));
        var flare = 1 + (lobe - 1) * depth;
        v.x *= flare; v.z *= flare;
        v.y -= size * 0.34 * depth * depth;
      } else if (ny < 0.15) {
        v.x *= 0.94; v.z *= 0.94;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  var N_BG = 157;
  var geoBg = createBlobGeometry(0.11, 8, 7, 6);
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
      -2.5 + Math.random() * 3
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
    return 0.18 + Math.pow(Math.random(), 1.8) * 1.62;
  });
  var bgScalePulse = Array.from({ length: N_BG }, function (_, i) {
    return bgScaleBase[i] * (0.04 + Math.random() * 0.1);
  });
  var bgColorIdx = Array.from({ length: N_BG }, function () {
    return pickBlobColorIndex();
  });

  var _m4 = new THREE.Matrix4(),
    _q = new THREE.Quaternion(),
    _pos = new THREE.Vector3(),
    _scBg = new THREE.Vector3(1, 1, 1),
    _eu = new THREE.Euler(),
    _col = new THREE.Color();

  function tick(t) {
    requestAnimationFrame(tick);
    var sec = t * 0.001;
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
        bgRot[i][2] + sec * bgSpn[i] * 0.85
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

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderer.render(scene, camera);
  } else {
    requestAnimationFrame(tick);
  }
})();
