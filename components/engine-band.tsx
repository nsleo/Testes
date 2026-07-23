"use client";

import * as motion from "motion/react-client";

const items = [
  ["01", "Act-based narrative", "A pagina respira por sequencias e não por blocos genéricos."],
  ["02", "Canvas-led entrance", "O primeiro impacto vem de palco visual, não de cards."],
  ["03", "Scroll as control surface", "O movimento responde à leitura em vez de apenas aparecer."],
  ["04", "Performance discipline", "Uma cena forte, poucos sistemas, bundle sob controle."]
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
