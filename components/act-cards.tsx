"use client";

import * as motion from "motion/react-client";

const acts = [
  {
    index: "Act I",
    title: "Impactar antes de explicar.",
    body: "O primeiro contato funciona como presenca visual: um sistema vivo, reativo e com densidade real."
  },
  {
    index: "Act II",
    title: "Demonstrar metodo em movimento.",
    body: "As secoes revelam comportamento, ritmo e controle em vez de repetir promessas em cards genericos."
  },
  {
    index: "Act III",
    title: "Fechar com autoridade, nao com formula.",
    body: "O encerramento age como prova de repertorio e direcao visual, sem cara de template comercial."
  }
];

export function ActCards() {
  return (
    <section className="act-cards" id="acts">
      <div className="act-cards__intro">
        <p>Arquitetura em sequencia</p>
        <h2>
          A experiencia avanca em tres atos, cada um com seu proprio peso visual,
          ritmo de scroll e funcao narrativa.
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
