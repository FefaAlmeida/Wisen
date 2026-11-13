"use client";

import { useEffect, useState } from "react";
import { requisitar } from "@/services/api";
import cards from "./constancia.module.css";
import { categories } from "./historicoDemo";
import { ScoreRing, scoreColor } from "./scoreRing";

// Illustrative scores for the explicitly labelled knowledge preview.
const demoScores = {
  Economia: 84,
  Política: 74,
  "Meio ambiente": 67,
  Tecnologia: 76,
  Sociedade: 59,
  Ciência: 86,
  Comércio: 58,
};

function illustrativeScore(name) {
  return (
    demoScores[name] ??
    30 + ([...name].reduce((sum, character) => sum + character.codePointAt(0), 0) % 61)
  );
}

export function DominioAreas() {
  const [interests, setInterests] = useState(categories.map((category) => category.name));

  useEffect(() => {
    const controller = new AbortController();
    requisitar("/auth/profile", { signal: controller.signal })
      .then((profile) => {
        const selected = profile.preferences?.interests;
        if (!controller.signal.aborted && Array.isArray(selected) && selected.length) {
          setInterests([...new Set(selected)]);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const areas = interests.map((name) => ({ name, value: illustrativeScore(name) }));
  const score = Math.round(areas.reduce((sum, area) => sum + area.value, 0) / areas.length);

  return (
    <div className={cards.areaLayout}>
      <ScoreRing value={score} />
      <ul className={cards.areaList} aria-label="Domínio por área de interesse">
        {areas.map(({ name, value }) => (
          <li key={name}>
            <div className={cards.areaLabel}>
              <span>{name}</span>
              <strong>{value}%</strong>
            </div>
            <div
              className={cards.areaTrack}
              role="progressbar"
              aria-label={name}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
            >
              <span style={{ width: `${value}%`, background: scoreColor(value) }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
