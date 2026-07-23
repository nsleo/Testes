"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger, svg } from "animejs";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { HeroConstellation } from "@/components/hero-constellation";

const tags = [
  "three.js scene core",
  "anime.js svg systems",
  "gsap sequencing",
  "motion layout transitions"
];

const titleLines = ["HEAVY", "MOTION", "PRECISE", "CONTROL"];

export function KineticHero() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"]
  });

  const copyY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -180]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72, 1], prefersReducedMotion ? [1, 1, 1] : [1, 0.92, 0.18]);
  const wireY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -110]);
  const wireRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -4]);
  const frameLeftY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -80]);
  const frameRightY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 120]);
  const bottomY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 70]);
  const stageScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 0.96]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timeline = createTimeline({
      defaults: { ease: "inOutQuad" }
    });

    const drawables = svg.createDrawable(".hero-block__wire");

    timeline
      .add(drawables, {
        draw: ["0 0", "0 1", "1 1"],
        duration: 1800,
        delay: stagger(90)
      })
      .add(
        ".hero-block__frame",
        {
          opacity: [0, 1],
          scale: [0.92, 1],
          duration: 900,
          delay: stagger(120)
        },
        "-=1300"
      )
      .add(
        ".hero-block__tag",
        {
          translateY: [22, 0],
          opacity: [0, 1],
          duration: 700,
          delay: stagger(70)
        },
        "-=1100"
      );

    const titleAnimation = animate(".hero-block__title-line", {
      y: ["112%", "0%"],
      opacity: [0, 1],
      rotateX: ["-65deg", "0deg"],
      delay: stagger(80),
      duration: 1300,
      ease: "outExpo"
    });

    const subtitleAnimation = animate(".hero-block__subcopy, .hero-block__cta-row, .hero-block__bottomline", {
      translateY: [26, 0],
      opacity: [0, 1],
      delay: stagger(110),
      duration: 900,
      ease: "outExpo"
    });

    return () => {
      timeline.cancel();
      titleAnimation.pause();
      subtitleAnimation.pause();
    };
  }, []);

  return (
    <section className="hero-block" ref={rootRef}>
      <div className="hero-block__chrome">
        <div className="hero-block__brand">
          <span className="hero-block__dot" aria-hidden="true" />
          <span>Modo kinetic study</span>
        </div>
        <div className="hero-block__meta">
          <span>Presentation prototype</span>
          <span>Built for high-ticket perception</span>
        </div>
      </div>

      <motion.div className="hero-block__stage" style={{ scale: stageScale }}>
        <HeroConstellation />

        <motion.div
          className="hero-block__wireframe"
          aria-hidden="true"
          style={{ y: wireY, rotateZ: wireRotate }}
        >
          <svg viewBox="0 0 1200 900">
            <path className="hero-block__wire" d="M42 170H1158" />
            <path className="hero-block__wire" d="M42 664H1158" />
            <path className="hero-block__wire" d="M164 76V824" />
            <path className="hero-block__wire" d="M824 76V824" />
            <path className="hero-block__wire" d="M164 170L824 664" />
            <path className="hero-block__wire" d="M824 170L164 664" />
            <path className="hero-block__wire" d="M492 76V824" />
          </svg>
        </motion.div>

        <motion.div className="hero-block__copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.p
            className="hero-block__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            The opening must feel like a controlled system booting in front of the visitor.
          </motion.p>

          <h1 className="hero-block__title">
            {titleLines.map((line) => (
              <span key={line} className="hero-block__title-mask">
                <span className="hero-block__title-line">{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero-block__subcopy">
            This hero now behaves like a presentation engine: one scene, one thesis,
            multiple visible motion systems, and zero institutional landing-page rhythm.
          </p>

          <div className="hero-block__cta-row">
            <a href="#acts" className="button button--solid">
              Enter sequence
            </a>
            <a href="#signals" className="button button--outline">
              Inspect motion stack
            </a>
          </div>

          <div className="hero-block__ticker">
            {tags.map((tag) => (
              <span key={tag} className="hero-block__tag">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="hero-block__frames">
          <motion.div
            className="hero-block__frame hero-block__frame--left"
            style={{ y: frameLeftY }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Vector field</span>
            <strong>Realtime orbital ribbons with pointer response.</strong>
          </motion.div>

          <motion.div
            className="hero-block__frame hero-block__frame--right"
            style={{ y: frameRightY }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Sequence note</span>
            <strong>Type, geometry and scene enter in layered timing, not one generic fade.</strong>
          </motion.div>
        </div>

        <motion.div className="hero-block__bottomline" style={{ y: bottomY }}>
          <span>Scene budget: 1 WebGL surface</span>
          <span>Motion stack: anime.js + motion + gsap + three.js</span>
          <span>Intent: cinematic premium without template behavior</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
