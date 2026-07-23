"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const beats = [
  "Abrir com um campo escuro e um nucleo cinetico que ja define percepcao.",
  "Prender a atencao em uma tese visual forte, nao em varios truques soltos.",
  "Liberar grade, texto e prova depois que o usuario sente o sistema reagir.",
  "Encerrar com sinal curto, tecnico e caro, sem excesso de explicacao."
];

export function StoryRail() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const items = root.querySelectorAll(".story-rail__beat");
    const headline = root.querySelector(".story-rail__headline");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headline) {
      tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 });
    }

    tl.fromTo(
      items,
      { opacity: 0, x: 42 },
      { opacity: 1, x: 0, duration: 0.75, stagger: 0.12 },
      "-=0.35"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="story-rail">
      <div className="story-rail__sticky">
        <p className="story-rail__label">Trilho narrativo</p>
        <h2 className="story-rail__headline">
          Uma tese de movimento, repetida com variacao e controle em vez de espetaculo aleatorio.
        </h2>
      </div>

      <div className="story-rail__beats">
        {beats.map((beat, index) => (
          <article key={beat} className="story-rail__beat">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{beat}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
