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
    scene.fog = new THREE.FogExp2(0x050308, 0.06);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.4, 14);

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

    const sculpture = new THREE.Group();
    world.add(sculpture);

    const columnMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x110d1f,
      emissive: 0x24134f,
      emissiveIntensity: 0.8,
      roughness: 0.24,
      metalness: 0.45,
      transparent: true,
      opacity: 0.92
    });

    const column = new THREE.Mesh(new THREE.CapsuleGeometry(1.35, 4.6, 16, 32), columnMaterial);
    sculpture.add(column);

    const head = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 6),
      new THREE.MeshPhysicalMaterial({
        color: 0x181223,
        emissive: 0x2d1b56,
        emissiveIntensity: 0.64,
        roughness: 0.22,
        metalness: 0.34,
        transparent: true,
        opacity: 0.94
      })
    );
    head.position.set(0.15, 3.65, 0.2);
    head.scale.set(0.9, 1.08, 0.9);
    sculpture.add(head);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.3, 2.7, 0.55, 40, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0x0f0b17,
        emissive: 0x1b1235,
        emissiveIntensity: 0.22,
        roughness: 0.5,
        metalness: 0.26,
        transparent: true,
        opacity: 0.5
      })
    );
    pedestal.position.set(0, -3.1, 0);
    sculpture.add(pedestal);

    const shards = [-1, 1].map((direction) => {
      const shard = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.72, 1),
        new THREE.MeshPhysicalMaterial({
          color: direction > 0 ? 0x9a84ff : 0x49d9ff,
          emissive: direction > 0 ? 0x29144d : 0x072d46,
          emissiveIntensity: 0.6,
          roughness: 0.16,
          metalness: 0.42,
          transparent: true,
          opacity: 0.78
        })
      );

      shard.position.set(direction * 2.35, 1.1, direction * 0.4);
      shard.rotation.set(direction * 0.6, direction * 0.2, direction * 0.9);
      sculpture.add(shard);

      return shard;
    });

    const shell = new THREE.Mesh(
      new THREE.OctahedronGeometry(3.25, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0x6f5dff,
        emissive: 0x1b0f3f,
        emissiveIntensity: 0.55,
        wireframe: true,
        transparent: true,
        opacity: 0.16
      })
    );
    sculpture.add(shell);

    const haloA = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.05, 32, 220),
      new THREE.MeshBasicMaterial({
        color: 0x8f7dff,
        transparent: true,
        opacity: 0.32
      })
    );
    haloA.rotation.x = Math.PI / 2.5;
    sculpture.add(haloA);

    const haloB = new THREE.Mesh(
      new THREE.TorusGeometry(6.5, 0.04, 24, 220),
      new THREE.MeshBasicMaterial({
        color: 0x00e0ff,
        transparent: true,
        opacity: 0.18
      })
    );
    haloB.rotation.x = Math.PI / 2.2;
    haloB.rotation.y = Math.PI / 3;
    sculpture.add(haloB);

    const ribbons = [
      createRibbon(0x8b75ff, 7.2, -1.8, 0.08),
      createRibbon(0x41cfff, 9.4, 1.3, -0.05),
      createRibbon(0xff7fd8, 11.4, -0.4, 0.04)
    ];

    ribbons.forEach((ribbon) => world.add(ribbon));

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 240;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xf3efff,
        size: 0.05,
        transparent: true,
        opacity: 0.62
      })
    );
    world.add(particles);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const violetLight = new THREE.PointLight(0x7f63ff, 22, 34, 2);
    violetLight.position.set(5, 4, 10);
    const cyanLight = new THREE.PointLight(0x00d5ff, 20, 32, 2);
    cyanLight.position.set(-7, -3, 11);
    const whiteLight = new THREE.SpotLight(0xffffff, 13, 40, 0.5, 0.7, 1);
    whiteLight.position.set(0, 10, 14);

    scene.add(ambient, violetLight, cyanLight, whiteLight);

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

      const targetProgress = progressRef.current;
      const curve = THREE.MathUtils.smoothstep(targetProgress, 0, 1);
      const phaseOne = THREE.MathUtils.smoothstep(curve, 0, 0.33);
      const phaseTwo = THREE.MathUtils.smoothstep(curve, 0.28, 0.7);
      const phaseThree = THREE.MathUtils.smoothstep(curve, 0.62, 1);

      world.position.y += ((curve - 0.5) * -3.2 - world.position.y) * 0.06;
      world.position.z += ((phaseThree * 1.8 - phaseOne * 0.5) - world.position.z) * 0.05;
      world.rotation.y += ((((curve * Math.PI) / 1.45) + pointer.x * 0.18) - world.rotation.y) * 0.045;
      world.rotation.x += (((pointer.y * 0.1) - 0.08 + curve * 0.06) - world.rotation.x) * 0.04;

      sculpture.position.x += (((curve - 0.5) * 3.6 + phaseTwo * 0.8 - phaseThree * 1.3) - sculpture.position.x) * 0.05;
      sculpture.position.y += ((((curve * 2.4) - 1.2) * 0.45 - phaseOne * 0.3 + phaseThree * 0.55) - sculpture.position.y) * 0.05;

      const scaleTarget = 1 + curve * 0.42 + phaseThree * 0.16;
      sculpture.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget * 1.08, scaleTarget), 0.05);

      column.rotation.y += 0.005 + curve * 0.004;
      column.rotation.x = Math.sin(time * 0.00035) * 0.08 + phaseTwo * 0.16;
      head.rotation.y += 0.0034 + phaseThree * 0.0016;
      head.rotation.z = Math.sin(time * 0.00022) * 0.08 - phaseTwo * 0.06;
      head.position.x = 0.15 + Math.sin(time * 0.00031) * 0.08 - phaseThree * 0.16;
      head.position.y = 3.65 + phaseTwo * 0.28 + phaseThree * 0.2;
      pedestal.rotation.y -= 0.0008;
      shell.rotation.x += 0.0026 + phaseTwo * 0.0012;
      shell.rotation.y -= 0.0034 + phaseThree * 0.0014;
      shell.material.opacity = 0.08 + curve * 0.12 + phaseTwo * 0.08 + phaseThree * 0.12;

      haloA.rotation.z += 0.0024 + curve * 0.0012 + phaseThree * 0.0015;
      haloB.rotation.z -= 0.0018 + curve * 0.0008 + phaseTwo * 0.0012;
      haloA.scale.setScalar(1 + curve * 0.08 + phaseTwo * 0.08);
      haloB.scale.setScalar(1 + curve * 0.18 + phaseThree * 0.14);
      haloA.material.opacity = 0.18 + phaseOne * 0.12 + phaseThree * 0.22;
      haloB.material.opacity = 0.1 + phaseTwo * 0.16 + phaseThree * 0.08;

      ribbons[0].rotation.z += 0.0019;
      ribbons[1].rotation.z -= 0.0014;
      ribbons[2].rotation.z += 0.0011;
      ribbons[0].position.y = Math.sin(time * 0.00052) * 0.6 - curve * 0.7 - phaseThree * 0.9;
      ribbons[1].position.y = Math.cos(time * 0.00045) * 0.8 + curve * 0.5 + phaseTwo * 0.65;
      ribbons[2].position.y = Math.sin(time * 0.00038 + 1.8) * 0.7 - phaseOne * 0.3 + phaseThree * 0.5;
      ribbons[0].material.opacity = 0.2 + phaseOne * 0.2 + phaseThree * 0.12;
      ribbons[1].material.opacity = 0.16 + phaseTwo * 0.3;
      ribbons[2].material.opacity = 0.12 + phaseThree * 0.34;

      shards[0].position.x = -2.35 - phaseTwo * 1.2;
      shards[0].position.y = 1.1 + Math.sin(time * 0.0006) * 0.34 + phaseThree * 0.3;
      shards[0].rotation.y += 0.006;
      shards[0].material.opacity = 0.16 + phaseTwo * 0.34;

      shards[1].position.x = 2.35 + phaseThree * 1.3;
      shards[1].position.y = 1.1 + Math.cos(time * 0.00054) * 0.28 - phaseOne * 0.2;
      shards[1].rotation.x -= 0.0048;
      shards[1].rotation.z += 0.0038;
      shards[1].material.opacity = 0.18 + phaseThree * 0.42;

      particles.rotation.y = time * 0.00004;
      particles.rotation.x = time * 0.00002;
      particles.position.y = -curve * 1.5 + phaseThree * 0.8;
      particles.material.opacity = 0.28 + phaseTwo * 0.2 + phaseThree * 0.22;

      violetLight.intensity = 12 + phaseOne * 10 + phaseThree * 16;
      cyanLight.intensity = 9 + (1 - curve) * 9 + phaseTwo * 8;
      whiteLight.intensity = 7 + phaseTwo * 4 + phaseThree * 7;
      camera.position.z = 14 - curve * 2.5 - phaseThree * 1.1;
      camera.position.x = curve * 1.6 - phaseThree * 1.4;
      camera.position.y = 0.4 + phaseTwo * 0.8 + phaseThree * 0.45;
      camera.lookAt(sculpture.position.x * 0.5, sculpture.position.y * 0.2, 0);

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.cancelAnimationFrame(frameId);
      mount.removeEventListener("pointermove", handleMove);
      mount.removeEventListener("pointerleave", resetMove);
      column.geometry.dispose();
      columnMaterial.dispose();
      head.geometry.dispose();
      (head.material as THREE.Material).dispose();
      pedestal.geometry.dispose();
      (pedestal.material as THREE.Material).dispose();
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      haloA.geometry.dispose();
      (haloA.material as THREE.Material).dispose();
      haloB.geometry.dispose();
      (haloB.material as THREE.Material).dispose();
      shards.forEach((shard) => {
        shard.geometry.dispose();
        shard.material.dispose();
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

function createRibbon(color: number, radius: number, yOffset: number, thickness: number) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7.5, yOffset - 0.8, -1.2),
    new THREE.Vector3(-2.8, yOffset + 1.3, 0.9),
    new THREE.Vector3(2.6, yOffset - 1.1, -0.4),
    new THREE.Vector3(7.6, yOffset + 0.9, 1.1)
  ]);

  const geometry = new THREE.TubeGeometry(curve, 180, thickness, 18, false);
  const material = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    roughness: 0.18,
    metalness: 0.4,
    emissive: color,
    emissiveIntensity: 0.22
  });

  const ribbon = new THREE.Mesh(geometry, material);
  ribbon.scale.setScalar(radius / 7.5);

  return ribbon;
}
