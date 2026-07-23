"use client";

import * as motion from "motion/react-client";

const signals = [
  "Sem hero institucional em fundo branco.",
  "Sem ritmo de features repetidas como template.",
  "Sem enquadramento comercial com cara de site comum.",
  "Sem animacao decorativa sem papel estrutural.",
  "Com peso cinematografico e leitura clara.",
  "Com interacao tratada como sinal de valor."
];

export function SignalWall() {
  return (
    <section className="signal-wall" id="signals">
      <div className="signal-wall__topline">
        <p>Parede de sinais</p>
        <a href="#top" className="button button--outline">
          Reiniciar sequencia
        </a>
      </div>

      <div className="signal-wall__stack">
        {signals.map((signal, index) => (
          <motion.div
            key={signal}
            className="signal-wall__row"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.72, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{signal}</strong>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
