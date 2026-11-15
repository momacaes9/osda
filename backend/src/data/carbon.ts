/**
 * OSDA carbon footprint calculator.
 *
 * ⚠️ This file is duplicated in frontend/src/data/carbon.ts (live preview) and
 * backend/src/data/carbon.ts (stored result). Keep both copies identical.
 *
 * Emission factors are rounded averages for a personal estimate, not an audit:
 * - Cars: UK DESNZ/DEFRA 2024 conversion factors (average car ≈ 0.17 kg CO2e/km),
 *   Brazilian ethanol (lifecycle ≈ 0.07 kg/km), EV on the Brazilian grid.
 * - Electricity: Brazil SIN grid ≈ 0.07 kg CO2e/kWh (MCTI), world average ≈ 0.45.
 * - Flights: DEFRA short/long haul per passenger incl. radiative forcing, round trip.
 * - Food: Poore & Nemecek (2018) — beef meal ≈ 5 kg, chicken/fish meal ≈ 1.2 kg.
 * - LPG cooking gas: ≈ 3 kg CO2 per kg of LPG (13 kg cylinder ≈ 39 kg).
 */
export type CarFuel = 'none' | 'gasoline' | 'ethanol' | 'diesel' | 'hybrid' | 'electric';
export type Grid = 'brazil' | 'world';

export interface CarbonInputs {
  carKmPerWeek: number; // 0..1000
  carFuel: CarFuel;
  transitHoursPerWeek: number; // bus/metro/train, 0..30
  shortFlightsPerYear: number; // round trips < 3h, 0..20
  longFlightsPerYear: number; // round trips > 3h, 0..10
  electricityKwhPerMonth: number; // 0..1500
  grid: Grid;
  gasCylindersPerYear: number; // 13 kg LPG, 0..24
  redMeatMealsPerWeek: number; // 0..21
  whiteMeatMealsPerWeek: number; // chicken/fish, 0..21
  newClothesPerMonth: number; // 0..20
  electronicsPerYear: number; // phones, laptops..., 0..10
}

export type CarbonCategory = 'transport' | 'flights' | 'home' | 'food' | 'shopping' | 'waste';

export interface CarbonResult {
  totalKg: number;
  byCategory: Record<CarbonCategory, number>;
  /** what changing the top habits could avoid per year */
  potentialSavingKg: number;
  /** money that could be saved per year, in local currency units */
  potentialSavingMoney: { brl: number; usd: number };
  profile: string;
}

export const DEFAULT_CARBON_INPUTS: CarbonInputs = {
  carKmPerWeek: 100,
  carFuel: 'gasoline',
  transitHoursPerWeek: 3,
  shortFlightsPerYear: 1,
  longFlightsPerYear: 0,
  electricityKwhPerMonth: 160,
  grid: 'brazil',
  gasCylindersPerYear: 6,
  redMeatMealsPerWeek: 5,
  whiteMeatMealsPerWeek: 5,
  newClothesPerMonth: 2,
  electronicsPerYear: 1,
};

export const LIMITS: Record<Exclude<keyof CarbonInputs, 'carFuel' | 'grid'>, [number, number, number]> = {
  // [min, max, step]
  carKmPerWeek: [0, 1000, 10],
  transitHoursPerWeek: [0, 30, 1],
  shortFlightsPerYear: [0, 20, 1],
  longFlightsPerYear: [0, 10, 1],
  electricityKwhPerMonth: [0, 1500, 10],
  gasCylindersPerYear: [0, 24, 1],
  redMeatMealsPerWeek: [0, 21, 1],
  whiteMeatMealsPerWeek: [0, 21, 1],
  newClothesPerMonth: [0, 20, 1],
  electronicsPerYear: [0, 10, 1],
};

const CAR_KG_PER_KM: Record<CarFuel, number> = {
  none: 0,
  gasoline: 0.17,
  ethanol: 0.07,
  diesel: 0.17,
  hybrid: 0.11,
  electric: 0.02,
};
const GRID_KG_PER_KWH: Record<Grid, number> = { brazil: 0.07, world: 0.45 };
const TRANSIT_KG_PER_HOUR = 1.5; // ~20 km by bus/metro
const SHORT_FLIGHT_KG = 250; // round trip
const LONG_FLIGHT_KG = 1600; // round trip
const LPG_CYLINDER_KG = 39;
const PLANT_BASE_DIET_KG = 900; // per year, plant-based baseline
const RED_MEAL_KG = 5;
const WHITE_MEAL_KG = 1.2;
const CLOTHING_ITEM_KG = 15;
const ELECTRONIC_ITEM_KG = 100;
const WASTE_BASE_KG = 300;

// Money: rough per-unit costs used only for "you could save" estimates
const COST = {
  brl: { carKm: 0.55, kwh: 0.85, clothing: 80, redMeal: 25 },
  usd: { carKm: 0.12, kwh: 0.16, clothing: 25, redMeal: 6 },
};

const clamp = (v: unknown, [min, max]: [number, number, number]) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
};

const FUELS: CarFuel[] = ['none', 'gasoline', 'ethanol', 'diesel', 'hybrid', 'electric'];

/** Sanitizes untrusted input into valid CarbonInputs. */
export function sanitizeCarbonInputs(raw: Partial<Record<keyof CarbonInputs, unknown>> | null | undefined): CarbonInputs {
  const src = raw ?? {};
  const out = { ...DEFAULT_CARBON_INPUTS };
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    out[key] = src[key] === undefined ? DEFAULT_CARBON_INPUTS[key] : clamp(src[key], LIMITS[key]);
  }
  out.carFuel = FUELS.includes(src.carFuel as CarFuel) ? (src.carFuel as CarFuel) : DEFAULT_CARBON_INPUTS.carFuel;
  out.grid = src.grid === 'world' ? 'world' : 'brazil';
  return out;
}

/**
 * @param wasteAnswer option id of questionnaire Q4 (waste) — 'A'..'D'
 */
export function calculateCarbon(inputs: CarbonInputs, wasteAnswer?: string): CarbonResult {
  const i = sanitizeCarbonInputs(inputs);
  const carKmYear = (i.carFuel === 'none' ? 0 : i.carKmPerWeek) * 52;

  const transport = carKmYear * CAR_KG_PER_KM[i.carFuel] + i.transitHoursPerWeek * 52 * TRANSIT_KG_PER_HOUR;
  const flights = i.shortFlightsPerYear * SHORT_FLIGHT_KG + i.longFlightsPerYear * LONG_FLIGHT_KG;
  const home = i.electricityKwhPerMonth * 12 * GRID_KG_PER_KWH[i.grid] + i.gasCylindersPerYear * LPG_CYLINDER_KG;
  const food = PLANT_BASE_DIET_KG + (i.redMeatMealsPerWeek * RED_MEAL_KG + i.whiteMeatMealsPerWeek * WHITE_MEAL_KG) * 52;
  const shopping = i.newClothesPerMonth * 12 * CLOTHING_ITEM_KG + i.electronicsPerYear * ELECTRONIC_ITEM_KG;
  const wasteFactor = { A: 1, B: 0.85, C: 0.7, D: 0.5 }[wasteAnswer ?? 'B'] ?? 0.85;
  const waste = WASTE_BASE_KG * wasteFactor;

  const byCategory = {
    transport: Math.round(transport),
    flights: Math.round(flights),
    home: Math.round(home),
    food: Math.round(food),
    shopping: Math.round(shopping),
    waste: Math.round(waste),
  };
  const totalKg = Object.values(byCategory).reduce((a, b) => a + b, 0);

  // Realistic, small changes ("one step"): drive 30% less, 10% less electricity,
  // halve red meat, buy 1/3 fewer clothes, one fewer short flight.
  const carSavedKm = carKmYear * 0.3;
  const kwhSaved = i.electricityKwhPerMonth * 12 * 0.1;
  const redMealsSaved = Math.round(i.redMeatMealsPerWeek / 2) * 52;
  const clothesSaved = i.newClothesPerMonth * 12 * (1 / 3);
  const potentialSavingKg = Math.round(
    carSavedKm * CAR_KG_PER_KM[i.carFuel] +
      kwhSaved * GRID_KG_PER_KWH[i.grid] +
      redMealsSaved * (RED_MEAL_KG - WHITE_MEAL_KG) +
      clothesSaved * CLOTHING_ITEM_KG +
      Math.min(1, i.shortFlightsPerYear) * SHORT_FLIGHT_KG,
  );
  const money = (c: (typeof COST)['brl']) =>
    Math.round(carSavedKm * c.carKm + kwhSaved * c.kwh + clothesSaved * c.clothing + redMealsSaved * c.redMeal * 0.4);

  return {
    totalKg,
    byCategory,
    potentialSavingKg,
    potentialSavingMoney: { brl: money(COST.brl), usd: money(COST.usd) },
    profile: consumerProfile(byCategory),
  };
}

/** Consumer profile = the area where the person's footprint concentrates. */
export function consumerProfile(by: Record<CarbonCategory, number>): string {
  const ranked = (Object.entries(by) as [CarbonCategory, number][])
    .filter(([k]) => k !== 'waste')
    .sort((a, b) => b[1] - a[1]);
  const [top, topKg] = ranked[0];
  const total = Object.values(by).reduce((a, b) => a + b, 0) || 1;
  if (total < 2000) return 'guardian';
  if (topKg / total < 0.3) return 'balanced';
  return { transport: 'commuter', flights: 'globetrotter', home: 'homebody', food: 'foodie', shopping: 'shopper' }[
    top as Exclude<CarbonCategory, 'waste'>
  ];
}

/** Reference values (tonnes CO2e per person per year) for comparison. */
export const REFERENCES = {
  brazil: 2.3, // energy-related CO2 per capita
  world: 4.7,
  target2030: 2.5, // 1.5 °C-compatible lifestyle target for 2030 (IGES, 2019)
};
