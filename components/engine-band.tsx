"use client";

import * as motion from "motion/react-client";

const items = [
  ["01", "Narrativa em atos", "A pagina respira por sequencias com tensao e pausa, nao por blocos equivalentes."],
  ["02", "Entrada por palco", "O primeiro impacto vem de um ambiente vivo, nao de um hero institucional comum."],
  ["03", "Scroll como direcao", "O movimento orienta a leitura, revela camadas e sustenta a sensacao de controle."],
  ["04", "Peso com disciplina", "A experiencia parece complexa, mas o sistema visual continua contido e otimizado."]
];

export function EngineBand() {
  return (
    <section className="engine-band">
      {items.map(([index, title, body], itemIndex) => (
        <motion.article
          key={index}
          className="engine-band__item"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: itemIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>{index}</span>
          <strong>{title}</strong>
          <p>{body}</p>
        </motion.article>
      ))}
    </section>
  );
}
