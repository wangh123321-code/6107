import type { BladeModel, RubberModel, RacketParams } from '@/types';

const W_BLADE = 0.55;
const W_FH = 0.28;
const W_BH = 0.17;

const RUBBER_AREA_CM2 = 450;

type SynergyFactors = {
  speed: number;
  spin: number;
  control: number;
  elasticity: number;
};

function calcSynergy(
  blade: BladeModel,
  forehand: RubberModel,
  backhand: RubberModel,
): SynergyFactors {
  const fhType = forehand.type;
  const bhType = backhand.type;
  const dominantRubberType = W_FH >= W_BH ? fhType : bhType;

  let speed = 1;
  let spin = 1;
  let control = 1;
  let elasticity = 1;

  if (blade.material === 'carbon' && dominantRubberType === 'sticky') {
    speed = 1.15;
    spin = 1.05;
  } else if (blade.material === 'arylate' && dominantRubberType === 'non-sticky') {
    control = 1.1;
    elasticity = 1.08;
  } else if (blade.material === 'wood' && dominantRubberType === 'sticky') {
    spin = 1.2;
    control = 0.95;
  } else if (blade.material === 'wood' && dominantRubberType === 'non-sticky') {
    speed = 0.9;
    control = 1.15;
  }

  if (fhType !== bhType) {
    control *= 1.03;
    spin *= 1.02;
  }

  return { speed, spin, control, elasticity };
}

function calcSpongeFactor(thickness: number): {
  speed: number;
  spin: number;
  control: number;
  elasticity: number;
} {
  const base = 0.85 + (thickness - 1.5) * 0.075;
  return {
    speed: base,
    spin: 0.9 + (thickness - 1.5) * 0.05,
    control: 1.15 - (thickness - 1.5) * 0.08,
    elasticity: base,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateRacketParams(
  blade: BladeModel,
  forehandRubber: RubberModel,
  backhandRubber: RubberModel,
  forehandSponge: number,
  backhandSponge: number,
): RacketParams {
  const synergy = calcSynergy(blade, forehandRubber, backhandRubber);
  const fhSponge = calcSpongeFactor(forehandSponge);
  const bhSponge = calcSpongeFactor(backhandSponge);

  const normalizeFactor = 1.05;

  const speedRaw =
    blade.speed * W_BLADE +
    forehandRubber.speed * W_FH * fhSponge.speed +
    backhandRubber.speed * W_BH * bhSponge.speed;
  const speed = clamp(speedRaw * synergy.speed * normalizeFactor, 0, 100);

  const spinRaw =
    blade.spin * W_BLADE +
    forehandRubber.spin * W_FH * fhSponge.spin +
    backhandRubber.spin * W_BH * bhSponge.spin;
  const spin = clamp(spinRaw * synergy.spin * normalizeFactor, 0, 100);

  const controlRaw =
    blade.control * W_BLADE +
    forehandRubber.control * W_FH * fhSponge.control +
    backhandRubber.control * W_BH * bhSponge.control;
  const control = clamp(controlRaw * synergy.control * normalizeFactor, 0, 100);

  const elasticityRaw =
    blade.elasticity * W_BLADE +
    forehandRubber.elasticity * W_FH * fhSponge.elasticity +
    backhandRubber.elasticity * W_BH * bhSponge.elasticity;
  const elasticity = clamp(elasticityRaw * synergy.elasticity * normalizeFactor, 0, 100);

  const fhWeight =
    RUBBER_AREA_CM2 * forehandRubber.weight * (1 + forehandSponge / 10);
  const bhWeight =
    RUBBER_AREA_CM2 * backhandRubber.weight * (1 + backhandSponge / 10);
  const weight = blade.weight + fhWeight + bhWeight;

  const fhHardness = forehandRubber.spongeHardness + (forehandSponge - 1.5) * 15;
  const bhHardness = backhandRubber.spongeHardness + (backhandSponge - 1.5) * 15;
  const hardness = (fhHardness * W_FH + bhHardness * W_BH) / (W_FH + W_BH);

  return {
    speed: Math.round(speed),
    spin: Math.round(spin),
    control: Math.round(control),
    elasticity: Math.round(elasticity),
    weight: Math.round(weight),
    hardness: Math.round(hardness * 10) / 10,
  };
}
