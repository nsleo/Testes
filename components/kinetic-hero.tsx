"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger, svg } from "animejs";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { HeroConstellation } from "@/components/hero-constellation";

const railMarks = ["01", "02", "03", "04"];
const titleLines = ["Museu", "da", "Presenca", "Digital"];

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
  const wireRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -2]);
  const noteY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 90]);
  const railY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -60]);
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
        ".hero-block__rail-mark",
        {
          opacity: [0, 1],
          translateX: [-18, 0],
          duration: 700,
          delay: stagger(120)
        },
        "-=1200"
      )
      .add(
        ".hero-block__note",
        {
          translateY: [28, 0],
          opacity: [0, 1],
          duration: 900
        },
        "-=1000"
      );

    const titleAnimation = animate(".hero-block__title-line", {
      y: ["112%", "0%"],
      opacity: [0, 1],
      rotateX: ["-65deg", "0deg"],
      delay: stagger(80),
      duration: 1300,
      ease: "outExpo"
    });

    const subtitleAnimation = animate(".hero-block__subcopy, .hero-block__cta-row, .hero-block__caption", {
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
    <section className="hero-block" id="top" ref={rootRef}>
      <div className="hero-block__chrome">
        <div className="hero-block__brand">
          <span className="hero-block__dot" aria-hidden="true" />
          <span>Atelier Performance</span>
        </div>
        <div className="hero-block__meta">
          <span>Apresentacao imersiva</span>
          <span>Sequencia editorial escura</span>
        </div>
      </div>

      <motion.div className="hero-block__stage" style={{ scale: stageScale }}>
        <HeroConstellation />

        <motion.div className="hero-block__rail" style={{ y: railY }}>
          <span className="hero-block__rail-line" />
          <div className="hero-block__rail-marks">
            {railMarks.map((mark) => (
              <span key={mark} className="hero-block__rail-mark">
                {mark}
              </span>
            ))}
          </div>
        </motion.div>

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
            Um palco de abertura para vender presenca premium antes da explicacao comercial.
          </motion.p>

          <h1 className="hero-block__title">
            {titleLines.map((line) => (
              <span key={line} className="hero-block__title-mask">
                <span className="hero-block__title-line">{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero-block__subcopy">
            Tipografia, profundidade e movimento trabalham como sistema. A leitura
            entra primeiro, o impacto visual confirma depois e a pagina ja comeca cara.
          </p>

          <div className="hero-block__cta-row">
            <a href="#acts" className="button button--solid">
              Entrar na experiencia
            </a>
            <a href="#signals" className="button button--outline">
              Ver estrutura
            </a>
          </div>
        </motion.div>

        <motion.aside
          className="hero-block__note"
          style={{ y: noteY }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-block__note-kicker">Nota curatorial</p>
          <p>
            A cena 3D nao disputa com o conteudo. Ela sustenta atmosfera, responde ao
            scroll e deixa a tipografia carregar autoridade.
          </p>
        </motion.aside>

        <motion.div className="hero-block__caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 0.65 }}>
          <span>Palco unico</span>
          <span>Scroll em camadas</span>
          <span>Ritmo editorial</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
