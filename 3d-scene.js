import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("forensic-canvas");
const section = document.getElementById("scroll-lab");
const progressLabel = document.getElementById("forensic-progress");

if (canvas && section) {
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(7, 5.5, 9);
  camera.lookAt(0, 0.3, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene.add(new THREE.AmbientLight(0x9acfe8, 1.8));

  const cyanLight = new THREE.PointLight(0x32d9ff, 65, 18);
  cyanLight.position.set(4, 5, 4);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0x855cff, 55, 18);
  violetLight.position.set(-5, 2, -3);
  scene.add(violetLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 2.5);
  topLight.position.set(2, 8, 5);
  scene.add(topLight);

  const root = new THREE.Group();
  scene.add(root);

  const components = [];

  function material(color, metalness = 0.55, roughness = 0.3, emissive = 0x000000) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness,
      emissive,
      emissiveIntensity: 0.35
    });
  }

  const dark = material(0x17263b, 0.8, 0.28);
  const edge = material(0x49637b, 0.8, 0.25);
  const cyan = material(0x25d8f2, 0.5, 0.25, 0x087b9a);
  const boardMat = material(0x123b42, 0.65, 0.38);
  const gold = material(0xc5a35b, 0.8, 0.25);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x071b2c,
    metalness: 0.35,
    roughness: 0.2,
    emissive: 0x087c9d,
    emissiveIntensity: 0.55
  });

  function box(parent, size, position, mat, bevel = false) {
    const geometry = new THREE.BoxGeometry(...size);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  function addComponent(name, position, exploded, rotation = [0,0,0]) {
    const group = new THREE.Group();
    group.position.set(...position);
    group.rotation.set(...rotation);
    root.add(group);

    components.push({
      name,
      group,
      assembled: new THREE.Vector3(...position),
      exploded: new THREE.Vector3(...exploded),
      assembledRotation: new THREE.Euler(...rotation),
      explodedRotation: new THREE.Euler(
        rotation[0] + 0.25,
        rotation[1] + 0.5,
        rotation[2] + 0.2
      )
    });

    return group;
  }

  // Laptop lower shell
  const deck = addComponent("Laptop chassis", [0,0,0], [0,-1.4,0]);
  box(deck, [4.4,0.2,2.8], [0,0,0], dark);
  box(deck, [4.28,0.035,2.68], [0,0.115,0], edge);

  // Keyboard keys
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) {
      box(
        deck,
        [0.235,0.045,0.22],
        [-1.85 + col * 0.3,0.16,-0.55 + row * 0.3],
        col % 4 === 0 ? cyan : edge
      );
    }
  }

  // Trackpad
  box(deck, [1.05,0.025,0.55], [0,0.16,0.91], edge);

  // Display assembly
  const display = addComponent("Display", [0,1.65,-1.25], [0,3.4,-1.8], [-0.12,0,0]);
  box(display, [4.4,2.9,0.16], [0,0,0], dark);
  box(display, [4.16,2.64,0.025], [0,0,0.095], screenMat);

  // Screen interface details
  box(display, [2.8,0.035,0.015], [0,0.7,0.12], cyan);
  box(display, [1.9,0.025,0.015], [0,-0.2,0.12], edge);
  box(display, [2.3,0.025,0.015], [0,-0.35,0.12], edge);

  // Motherboard
  const board = addComponent("Motherboard", [0,0.4,0], [0,1.4,0.2]);
  box(board, [2.9,0.12,1.7], [0,0,0], boardMat);

  // Circuit traces
  for (let i = 0; i < 7; i++) {
    box(board, [0.035,0.025,1.2], [-1.1 + i*0.35,0.075,0], cyan);
  }

  // CPU / processor
  const cpu = addComponent("Processor", [0,0.55,0], [0.25,2.5,0.1]);
  box(cpu, [0.85,0.18,0.85], [0,0,0], gold);
  box(cpu, [0.58,0.08,0.58], [0,0.13,0], dark);
  box(cpu, [0.36,0.035,0.36], [0,0.19,0], cyan);

  // RAM modules
  const ram = addComponent("Memory", [1.25,0.65,-0.35], [2.6,1.4,-0.7]);
  box(ram, [1.5,0.1,0.36], [0,0,0], dark);
  for (let i = 0; i < 5; i++) {
    box(ram, [0.2,0.09,0.27], [-0.55 + i*0.27,0.07,0], cyan);
  }

  // Storage drive
  const storage = addComponent("Storage", [-1.1,0.65,0.5], [-2.5,1.9,1]);
  box(storage, [1.15,0.16,0.85], [0,0,0], edge);
  box(storage, [0.75,0.04,0.5], [0,0.11,0], dark);
  box(storage, [0.22,0.025,0.18], [0,0.14,0], cyan);

  // Cooling fan
  const fan = addComponent("Cooling system", [1.25,0.45,0.65], [2.6,-0.1,1.2]);
  const fanBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55,0.55,0.13,40),
    dark
  );
  fanBase.rotation.x = Math.PI / 2;
  fan.add(fanBase);

  const fanHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16,0.16,0.17,24),
    cyan
  );
  fanHub.rotation.x = Math.PI / 2;
  fanHub.position.z = 0.08;
  fan.add(fanHub);

  for (let i = 0; i < 7; i++) {
    const angle = i * Math.PI * 2 / 7;
    const blade = box(
      fan,
      [0.13,0.045,0.36],
      [Math.cos(angle)*0.25,Math.sin(angle)*0.25,0.1],
      edge
    );
    blade.rotation.z = angle;
  }

  // Floating data particles
  const particleCount = 240;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i*3] = (Math.random() - 0.5) * 11;
    particlePositions[i*3+1] = (Math.random() - 0.5) * 7;
    particlePositions[i*3+2] = (Math.random() - 0.5) * 9;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions,3)
  );

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x55dff5,
      size: 0.025,
      transparent: true,
      opacity: 0.65
    })
  );
  scene.add(particles);

  // Circular scanning rings
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x25d8f2,
    transparent: true,
    opacity: 0.22
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.3,0.009,8,120),
    ringMaterial
  );
  ring.rotation.x = Math.PI / 2.5;
  root.add(ring);

  let progress = 0;
  let targetProgress = 0;
  let frameId = 0;

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;

    renderer.setSize(width,height,false);
    camera.aspect = width/height;
    camera.position.x = width < 600 ? 6.8 : 7;
    camera.position.y = width < 600 ? 6.1 : 5.5;
    camera.position.z = width < 600 ? 10.5 : 9;
    camera.lookAt(0,0.35,0);
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const distance = section.offsetHeight - window.innerHeight;
    targetProgress = THREE.MathUtils.clamp(
      -rect.top / Math.max(distance,1),
      0,
      1
    );
  }

  window.addEventListener("scroll",updateScroll,{passive:true});
  window.addEventListener("resize",resize);
  updateScroll();

  const clock = new THREE.Clock();

  function animate() {
    frameId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    progress = THREE.MathUtils.lerp(progress,targetProgress,0.075);

    // Explode in the middle, then reassemble toward the end.
    const explosion = 1 - Math.abs(progress - 0.5) * 2;
    const amount = THREE.MathUtils.smoothstep(explosion,0,1);

    components.forEach((item,index) => {
      item.group.position.lerpVectors(
        item.assembled,
        item.exploded,
        amount
      );

      item.group.position.y +=
        Math.sin(elapsed*1.2 + index) * 0.035;

      item.group.rotation.x = THREE.MathUtils.lerp(
        item.assembledRotation.x,
        item.explodedRotation.x,
        amount
      );

      item.group.rotation.y = THREE.MathUtils.lerp(
        item.assembledRotation.y,
        item.explodedRotation.y,
        amount
      ) + elapsed*0.035;

      item.group.rotation.z = THREE.MathUtils.lerp(
        item.assembledRotation.z,
        item.explodedRotation.z,
        amount
      );
    });

    root.rotation.y = Math.sin(progress * Math.PI * 2) * 0.22;
    root.rotation.x = Math.sin(elapsed*0.25) * 0.025;
    ring.rotation.z = elapsed * 0.08;
    particles.rotation.y = elapsed * 0.012;

    if (progressLabel) {
      progressLabel.textContent =
        String(Math.round(progress*100)).padStart(2,"0") + " / 100";
    }

    renderer.render(scene,camera);
  }

  animate();

  document.addEventListener("visibilitychange",() => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else {
      animate();
    }
  });
}
