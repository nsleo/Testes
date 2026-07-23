"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ExhibitionSceneProps = {
  progress: number;
};

export function ExhibitionScene({ progress }: ExhibitionSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);

  progressRef.current = progress;

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04020a, 0.055);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.2, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 7),
      new THREE.MeshPhysicalMaterial({
        color: 0x180d2a,
        emissive: 0x3a1e72,
        emissiveIntensity: 1.05,
        roughness: 0.18,
        metalness: 0.52,
        transparent: true,
        opacity: 0.94
      })
    );
    world.add(nucleus);

    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x132d46,
        transparent: true,
        opacity: 0.12
      })
    );
    world.add(coreGlow);

    const orbitSpecs = [
      { radius: 3.4, tube: 0.032, color: 0x8b75ff, tiltX: 0.9, tiltY: 0.22 },
      { radius: 5.2, tube: 0.028, color: 0x28d7ff, tiltX: 1.2, tiltY: -0.5 },
      { radius: 7.1, tube: 0.024, color: 0xff82dd, tiltX: 0.55, tiltY: 0.82 }
    ] as const;

    const orbitRings = orbitSpecs.map((spec) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(spec.radius, spec.tube, 18, 260),
        new THREE.MeshBasicMaterial({
          color: spec.color,
          transparent: true,
          opacity: 0.22
        })
      );

      ring.rotation.x = spec.tiltX;
      ring.rotation.y = spec.tiltY;
      world.add(ring);

      return ring;
    });

    const satellites = orbitSpecs.map((spec, index) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.17 : index === 1 ? 0.2 : 0.24, 18, 18),
        new THREE.MeshBasicMaterial({
          color: spec.color,
          transparent: true,
          opacity: 0.92
        })
      );
      world.add(mesh);

      return mesh;
    });

    const accentNodes = [
      createAccentNode(0xffd166, new THREE.Vector3(-1.4, 2.2, 1.1)),
      createAccentNode(0x7cf7ff, new THREE.Vector3(1.8, -1.4, -0.8)),
      createAccentNode(0xc69cff, new THREE.Vector3(0.4, 1.1, 2.3))
    ];

    accentNodes.forEach((node) => world.add(node));

    const ribbons = [
      createRibbon(0x7d61ff, 8.4, -1.7, 0.065),
      createRibbon(0x1fd5ff, 10.2, 1.2, -0.04),
      createRibbon(0xff74d4, 11.8, -0.1, 0.03)
    ];

    ribbons.forEach((ribbon) => world.add(ribbon));

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 320;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 4 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.045,
        transparent: true,
        opacity: 0.58
      })
    );
    world.add(particles);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    const violetLight = new THREE.PointLight(0x7b63ff, 16, 28, 2);
    violetLight.position.set(4, 3, 8);
    const cyanLight = new THREE.PointLight(0x00d4ff, 14, 28, 2);
    cyanLight.position.set(-5, -3, 9);
    const goldLight = new THREE.PointLight(0xffcf63, 10, 22, 2);
    goldLight.position.set(0, 5, 6);

    scene.add(ambient, violetLight, cyanLight, goldLight);

    const resizeRenderer = () => {
      const { clientWidth, clientHeight } = mount;
      const canvas = renderer.domElement;
      const needResize =
        canvas.width !== clientWidth * renderer.getPixelRatio() ||
        canvas.height !== clientHeight * renderer.getPixelRatio();

      if (needResize) {
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    const pointer = { x: 0, y: 0 };

    const handleMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    };

    const resetMove = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    mount.addEventListener("pointermove", handleMove);
    mount.addEventListener("pointerleave", resetMove);

    let frameId = 0;

    const render = (time: number) => {
      resizeRenderer();

      const curve = THREE.MathUtils.smoothstep(progressRef.current, 0, 1);
      const phaseOne = THREE.MathUtils.smoothstep(curve, 0, 0.3);
      const phaseTwo = THREE.MathUtils.smoothstep(curve, 0.26, 0.68);
      const phaseThree = THREE.MathUtils.smoothstep(curve, 0.62, 1);

      world.position.y += ((curve - 0.5) * -2.8 - world.position.y) * 0.06;
      world.rotation.y += ((((curve * Math.PI) / 1.8) + pointer.x * 0.16) - world.rotation.y) * 0.045;
      world.rotation.x += (((pointer.y * 0.1) - 0.05 + curve * 0.04) - world.rotation.x) * 0.04;
      world.position.z += ((phaseThree * 1.6 - phaseOne * 0.35) - world.position.z) * 0.05;

      const nucleusScale = 1 + curve * 0.16 + phaseThree * 0.14;
      nucleus.scale.lerp(new THREE.Vector3(nucleusScale, nucleusScale, nucleusScale), 0.05);
      nucleus.rotation.x += 0.0028 + phaseTwo * 0.0012;
      nucleus.rotation.y += 0.0036 + phaseThree * 0.0016;

      coreGlow.scale.setScalar(1 + phaseOne * 0.08 + phaseTwo * 0.14 + phaseThree * 0.24);
      coreGlow.material.opacity = 0.06 + phaseOne * 0.06 + phaseThree * 0.08;

      orbitRings.forEach((ring, index) => {
        ring.rotation.z += 0.0012 + index * 0.0005 + phaseThree * 0.001;
        ring.material.opacity = 0.08 + phaseOne * 0.08 + phaseTwo * 0.08 + phaseThree * 0.1;
        const scale = 1 + phaseTwo * (index + 1) * 0.04 + phaseThree * (index + 1) * 0.03;
        ring.scale.setScalar(scale);
      });

      satellites.forEach((satellite, index) => {
        const radius = orbitSpecs[index].radius * (1 + phaseTwo * 0.04 + phaseThree * 0.03);
        const speed = 0.00055 + index * 0.00014;
        const angle = time * speed + index * 2.2 + phaseThree * 0.85;
        const elevation = Math.sin(time * (speed * 0.7) + index) * (0.45 + index * 0.18);

        satellite.position.set(
          Math.cos(angle) * radius,
          elevation + Math.sin(angle * 0.7) * 0.4,
          Math.sin(angle) * radius
        );
      });

      accentNodes[0].position.x = -1.4 - phaseOne * 1.2;
      accentNodes[0].position.y = 2.2 + Math.sin(time * 0.00045) * 0.4;
      accentNodes[1].position.x = 1.8 + phaseTwo * 1.5;
      accentNodes[1].position.y = -1.4 + Math.cos(time * 0.00052) * 0.35;
      accentNodes[2].position.z = 2.3 + phaseThree * 1.3;

      accentNodes.forEach((node, index) => {
        node.rotation.x += 0.004 + index * 0.001;
        node.rotation.y -= 0.003 + index * 0.0008;
      });

      ribbons[0].rotation.z += 0.0014;
      ribbons[1].rotation.z -= 0.0012;
      ribbons[2].rotation.z += 0.001;
      ribbons[0].position.y = Math.sin(time * 0.00048) * 0.55 - phaseThree * 0.8;
      ribbons[1].position.y = Math.cos(time * 0.0004) * 0.7 + phaseTwo * 0.55;
      ribbons[2].position.y = Math.sin(time * 0.00034 + 1.6) * 0.62 + phaseThree * 0.32;
      ribbons[0].material.opacity = 0.16 + phaseOne * 0.12 + phaseThree * 0.12;
      ribbons[1].material.opacity = 0.14 + phaseTwo * 0.18;
      ribbons[2].material.opacity = 0.12 + phaseThree * 0.24;

      particles.rotation.y = time * 0.000035;
      particles.rotation.x = time * 0.000015;
      particles.position.y = -curve * 1.2 + phaseThree * 0.7;
      particles.material.opacity = 0.24 + phaseTwo * 0.14 + phaseThree * 0.18;

      violetLight.intensity = 10 + phaseOne * 6 + phaseThree * 10;
      cyanLight.intensity = 8 + phaseTwo * 8 + (1 - curve) * 4;
      goldLight.intensity = 4 + phaseOne * 4 + phaseThree * 3;

      camera.position.z = 14 - curve * 2.2 - phaseThree * 0.9;
      camera.position.x = curve * 1.2 - phaseThree * 0.9;
      camera.position.y = 0.2 + phaseTwo * 0.7 + phaseThree * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.cancelAnimationFrame(frameId);
      mount.removeEventListener("pointermove", handleMove);
      mount.removeEventListener("pointerleave", resetMove);
      nucleus.geometry.dispose();
      (nucleus.material as THREE.Material).dispose();
      coreGlow.geometry.dispose();
      (coreGlow.material as THREE.Material).dispose();
      orbitRings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      satellites.forEach((satellite) => {
        satellite.geometry.dispose();
        satellite.material.dispose();
      });
      accentNodes.forEach((node) => {
        node.geometry.dispose();
        node.material.dispose();
      });
      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      });
      particlesGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="exhibition-scene" ref={mountRef} aria-hidden="true" />;
}

function createAccentNode(color: number, position: THREE.Vector3) {
  const mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 1),
    new THREE.MeshPhysicalMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.22,
      roughness: 0.12,
      metalness: 0.36,
      transparent: true,
      opacity: 0.92
    })
  );

  mesh.position.copy(position);
  return mesh;
}

function createRibbon(color: number, scale: number, offset: number, radius: number) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, -1.1 + offset, 0.7),
    new THREE.Vector3(-1.2, 1.4 + offset, -0.6),
    new THREE.Vector3(1.1, -0.8 + offset, 1),
    new THREE.Vector3(2.8, 1 + offset, -0.8)
  ]);

  const geometry = new THREE.TubeGeometry(curve, 150, radius, 16, false);
  geometry.scale(scale, scale, scale);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity: 0.72,
    roughness: 0.12,
    metalness: 0.28,
    emissive: color,
    emissiveIntensity: 0.26
  });

  return new THREE.Mesh(geometry, material);
}
