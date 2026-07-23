"use client";

import * as motion from "motion/react-client";

const acts = [
  {
    index: "Act I",
    title: "Shock the visitor before any explanation.",
    body: "Primeiro contato como performance visual: um sistema vivo, responsivo e com densidade gráfica real."
  },
  {
    index: "Act II",
    title: "Explain the method through moving systems.",
    body: "Os blocos demonstram comportamento e não apenas benefícios escritos em cards equivalentes."
  },
  {
    index: "Act III",
    title: "Close with authority, not with a template CTA.",
    body: "O final funciona como prova de repertório e direção, sem depender de fórmulas de landing page."
  }
];

export function ActCards() {
  return (
    <section className="act-cards" id="acts">
      <div className="act-cards__intro">
        <p>Sequence architecture</p>
        <h2>
          The experience now moves in three acts, each with its own visual
          tempo and interaction weight.
        </h2>
      </div>

      <div className="act-cards__grid">
        {acts.map((act, index) => (
          <motion.article
            key={act.index}
            className="act-cards__card"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{act.index}</span>
            <h3>{act.title}</h3>
            <p>{act.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
