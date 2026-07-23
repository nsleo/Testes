"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const beats = [
  "Launch with a dark field and a kinetic core.",
  "Pin the attention on one moving thesis instead of many decorative tricks.",
  "Open the grid only after the visitor has already felt the system move.",
  "Keep the final signal terse, technical and expensive."
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
        <p className="story-rail__label">Narrative rail</p>
        <h2 className="story-rail__headline">
          One motion thesis, repeated with variation instead of random spectacle.
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
