"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger, svg } from "animejs";

const phrases = [
  "Abertura com gesto e resposta física.",
  "Tipografia como matéria em movimento.",
  "Estrutura que troca seções por atos.",
  "Interação como argumento de valor."
];

export function MotionManifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const drawables = svg.createDrawable(".motion-manifesto__line");
    const timeline = createTimeline({ defaults: { ease: "inOutQuad" } });

    timeline
      .add(drawables, {
        draw: ["0 0", "0 1", "1 1"],
        duration: 2200,
        delay: stagger(110)
      })
      .add(
        ".motion-manifesto__pulse",
        {
          scale: [0.82, 1],
          opacity: [0, 1],
          duration: 900,
          delay: stagger(120)
        },
        "-=1500"
      )
      .add(
        ".motion-manifesto__copy-row",
        {
          translateX: [42, 0],
          opacity: [0, 1],
          duration: 900,
          delay: stagger(130)
        },
        "-=1200"
      );

    const headerAnimation = animate(".motion-manifesto__title-word", {
      y: ["110%", "0%"],
      opacity: [0, 1],
      delay: stagger(90),
      duration: 1200,
      ease: "outExpo",
      autoplay: false
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          headerAnimation.play();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      timeline.cancel();
      headerAnimation.pause();
    };
  }, []);

  return (
    <section className="motion-manifesto" id="manifesto" ref={rootRef}>
      <div className="motion-manifesto__header">
        <p className="motion-manifesto__label">Motion language / anti-template sequence</p>
        <h2>
          <span className="motion-manifesto__title-word">Not a page.</span>
          <span className="motion-manifesto__title-word">A controlled collision</span>
          <span className="motion-manifesto__title-word">between code, type and motion.</span>
        </h2>
      </div>

      <div className="motion-manifesto__grid">
        <div className="motion-manifesto__diagram">
          <svg viewBox="0 0 520 520" aria-hidden="true">
            <circle className="motion-manifesto__line" cx="260" cy="260" r="164" />
            <circle className="motion-manifesto__line" cx="260" cy="260" r="108" />
            <path className="motion-manifesto__line" d="M102 260H418" />
            <path className="motion-manifesto__line" d="M260 102V418" />
            <path className="motion-manifesto__line" d="M148 148L372 372" />
            <path className="motion-manifesto__line" d="M372 148L148 372" />
          </svg>

          <div className="motion-manifesto__pulse motion-manifesto__pulse--one" />
          <div className="motion-manifesto__pulse motion-manifesto__pulse--two" />
          <div className="motion-manifesto__pulse motion-manifesto__pulse--three" />
        </div>

        <div className="motion-manifesto__copy">
          {phrases.map((phrase) => (
            <div key={phrase} className="motion-manifesto__copy-row">
              <span />
              <p>{phrase}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
