// src/application/study/sm2.ts
export type Sm2State = {
  easeFactor: number;
  interval: number;
  repetition: number;
};

export function applySm2(prev: Sm2State, quality: number) {
  // quality: 0..5 (inteiro)
  // Returns new state and computed nextInterval (days)
  let { easeFactor: EF, interval, repetition } = prev;

  if (quality < 3) {
    // failed: reset repetitions
    repetition = 0;
    interval = 1;
  } else {
    repetition = repetition + 1;
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      // interval = round(previous_interval * EF)
      interval = Math.round(interval * EF) || 1;
    }

    // update EF
    const newEF = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    EF = Math.max(1.3, Number(newEF.toFixed(2)));
  }

  return { easeFactor: EF, interval, repetition };
}
