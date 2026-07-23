"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ExhibitionScene } from "@/components/exhibition-scene";

const sequence = [
  {
    index: "01",
    title: "Presenca",
    body: "Um unico corpo visual atravessa toda a pagina.",
    note: "Abertura silenciosa",
    align: "left"
  },
  {
    index: "02",
    title: "Mutacao",
    body: "O fundo reage ao scroll e muda de densidade sem trocar de identidade.",
    note: "Mudanca de estado",
    align: "right"
  },
  {
    index: "03",
    title: "Controle",
    body: "Peso cinematografico com leitura limpa e disciplina tecnica.",
    note: "Fechamento preciso",
    align: "center"
  }
];

export function ExhibitionExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [1, 0.92, 0.18]);
  const labelY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const phase = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  return (
    <main className="exhibition-page" ref={rootRef}>
      <div className="exhibition-page__fixed">
        <ExhibitionScene progress={progress} />
        <div className="exhibition-page__veil" />
      </div>

      <section className="exhibition-page__hero">
        <motion.div className="exhibition-page__intro" style={{ y: heroY, opacity: heroOpacity }}>
          <p className="exhibition-page__kicker">High ticket motion study / route beta</p>
          <div className="exhibition-page__phase-badge">
            <span>{sequence[phase]?.index}</span>
            <p>{sequence[phase]?.note}</p>
          </div>
          <h1>
            Uma mesma obra.
            <br />
            Estados diferentes
            <br />
            ao longo do scroll.
          </h1>
          <p className="exhibition-page__lede">
            Um teste para provar que IA tambem pode construir atmosfera, assinatura
            e continuidade real em projetos de ticket extremo.
          </p>
        </motion.div>
      </section>

      <section className="exhibition-page__runway">
        <motion.div className="exhibition-page__rail" style={{ y: labelY }}>
          <span>Laboratorio visual</span>
          <span>Fundo continuo</span>
          <span>Scroll como direcao</span>
        </motion.div>

        <div className="exhibition-page__phase-indicator" aria-hidden="true">
          {sequence.map((item, index) => (
            <span key={item.index} className={index === phase ? "is-active" : undefined} />
          ))}
        </div>

        <div className="exhibition-page__stack">
          {sequence.map((item, index) => (
            <motion.article
              key={item.index}
              className={`exhibition-page__act exhibition-page__act--${item.align}`}
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="exhibition-page__act-meta">
                <span>{item.index}</span>
                <p>{item.note}</p>
              </div>
              <div className="exhibition-page__act-copy">
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="exhibition-page__quote">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Se a sensacao no fim for de ter atravessado um unico ambiente vivo,
          o teste cumpriu o papel.
        </motion.p>
      </section>

      <section className="exhibition-page__coda">
        <motion.div
          className="exhibition-page__coda-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>04</span>
          <h2>Persistencia</h2>
          <p>Quando o fundo permanece na memoria, a pagina deixa de parecer montagem.</p>
        </motion.div>
      </section>

      <section className="exhibition-page__outro">
        <motion.div
          className="exhibition-page__outro-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>Direcao pensada para ticket extremo.</p>
          <a href="/" className="button button--outline">
            Voltar para a home base
          </a>
        </motion.div>
      </section>
    </main>
  );
}
