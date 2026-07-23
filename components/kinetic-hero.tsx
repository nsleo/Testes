"use client";

import * as motion from "motion/react-client";
import { HeroConstellation } from "@/components/hero-constellation";

const tags = [
  "three.js scene core",
  "anime.js svg systems",
  "gsap sequencing",
  "motion layout transitions"
];

export function KineticHero() {
  return (
    <section className="hero-block">
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

      <div className="hero-block__stage">
        <div className="hero-block__copy">
          <motion.p
            className="hero-block__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            A demonstracao precisa parecer um instrumento em movimento, nao um
            site institucional com animacao por cima.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Heavy motion.
            <br />
            Precise control.
            <br />
            No template rhythm.
          </motion.h1>

          <motion.p
            className="hero-block__lede"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            Esta versao troca a landing previsivel por uma experiencia escura,
            cinetica e demonstrativa. O discurso agora vem da propria interacao.
          </motion.p>

          <motion.div
            className="hero-block__actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#acts" className="button button--solid">
              Enter sequence
            </a>
            <a href="#signals" className="button button--outline">
              Inspect motion stack
            </a>
          </motion.div>

          <div className="hero-block__ticker">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <HeroConstellation />
      </div>
    </section>
  );
}
