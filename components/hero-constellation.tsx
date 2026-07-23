"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

export function HeroConstellation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ribbons = [
      createRibbon(0x82f7ff, 0.24, 3.3, -0.2),
      createRibbon(0xff3bd4, 0.22, 2.7, 0.16),
      createRibbon(0x7c59ff, 0.18, 2.1, -0.34)
    ];

    ribbons.forEach((ribbon) => root.add(ribbon));

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 8),
      new THREE.MeshPhysicalMaterial({
        color: 0x140824,
        emissive: 0x2e1f69,
        emissiveIntensity: 0.8,
        roughness: 0.22,
        metalness: 0.55,
        transparent: true,
        opacity: 0.88
      })
    );
    root.add(orb);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.04, 24, 220),
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35
      })
    );
    halo.rotation.x = Math.PI / 2.5;
    root.add(halo);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        transparent: true,
        opacity: 0.65
      })
    );
    root.add(particles);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const cyan = new THREE.PointLight(0x00f0ff, 12, 24, 2);
    cyan.position.set(4, 3, 9);
    const magenta = new THREE.PointLight(0xff3bd4, 12, 24, 2);
    magenta.position.set(-5, -2, 8);

    scene.add(ambient, cyan, magenta);

    const intro = gsap.timeline();
    intro
      .fromTo(root.scale, { x: 0.75, y: 0.75, z: 0.75 }, { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out" })
      .fromTo(root.rotation, { x: -0.3, y: -0.5 }, { x: 0.15, y: 0.35, duration: 1.8, ease: "power3.out" }, 0);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0.15, y: 0.35 };

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

    const handleMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

      gsap.to(target, {
        x: 0.15 + pointer.y * 0.32,
        y: 0.35 + pointer.x * 0.48,
        duration: 0.85,
        ease: "power3.out",
        overwrite: true
      });
    };

    const resetMove = () => {
      gsap.to(target, {
        x: 0.15,
        y: 0.35,
        duration: 1.2,
        ease: "power3.out"
      });
    };

    let frameId = 0;

    const render = (time: number) => {
      resizeRenderer();

      root.rotation.x += (target.x - root.rotation.x) * 0.05;
      root.rotation.y += (target.y - root.rotation.y) * 0.05;
      orb.rotation.x += 0.003;
      orb.rotation.y += 0.004;
      halo.rotation.z += 0.0035;
      particles.rotation.y = time * 0.00008;
      ribbons[0].rotation.z += 0.0028;
      ribbons[1].rotation.z -= 0.0024;
      ribbons[2].rotation.z += 0.0018;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    mount.addEventListener("pointermove", handleMove);
    mount.addEventListener("pointerleave", resetMove);
    render(0);

    return () => {
      window.cancelAnimationFrame(frameId);
      mount.removeEventListener("pointermove", handleMove);
      mount.removeEventListener("pointerleave", resetMove);
      intro.kill();
      ribbons.forEach((ribbon) => {
        const mesh = ribbon as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      orb.geometry.dispose();
      (orb.material as THREE.Material).dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      particlesGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-block__canvas-shell" ref={mountRef} aria-hidden="true" />;
}

function createRibbon(color: number, radius: number, scale: number, offset: number) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.8, -1.2 + offset, 0.8),
    new THREE.Vector3(-1.2, 1.3 + offset, -0.5),
    new THREE.Vector3(0.9, -0.7 + offset, 1.1),
    new THREE.Vector3(2.6, 1 + offset, -0.7)
  ]);

  const geometry = new THREE.TubeGeometry(curve, 120, radius, 18, false);
  geometry.scale(scale, scale, scale);

  return new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity: 0.78,
      roughness: 0.12,
      metalness: 0.32,
      emissive: color,
      emissiveIntensity: 0.32
    })
  );
}
