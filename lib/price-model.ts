// Oman MIS hourly price profile (OMR/MWh)
// Calibrated to APSR 2024 + Nama PWP 2022 MIS hourly observations
export const OMAN_PRICE_PROFILE_24H: number[] = [
  // 00-05 deep off-peak
  5.8, 5.4, 5.1, 4.9, 5.0, 5.3,
  // 06-09 morning ramp
  6.2, 7.8, 9.4, 10.8,
  // 10-14 solar peak (depressed)
  11.2, 10.6, 9.8, 9.2, 10.1,
  // 15-17 afternoon ramp
  11.8, 13.4, 15.2,
  // 18-21 evening peak
  18.6, 22.1, 19.4, 15.8,
  // 22-23 night decline
  12.2, 8.9,
];

export function getRealtimePrice(
  hour: number,
  minute: number = 0,
  noiseLevel: number = 0.15,
): number {
  const base = OMAN_PRICE_PROFILE_24H[hour];
  const next = OMAN_PRICE_PROFILE_24H[(hour + 1) % 24];
  const timeInterp = (minute / 60) * (next - base);
  const noise = (Math.random() - 0.5) * 2 * base * noiseLevel;
  return Math.max(4.0, base + timeInterp + noise);
}

export function getPriceForecast(currentHour: number): {
  forecast: number[];
  upperBand: number[];
  lowerBand: number[];
} {
  const forecast: number[] = [];
  const upperBand: number[] = [];
  const lowerBand: number[] = [];
  for (let i = 0; i < 8; i++) {
    const h = (currentHour + i) % 24;
    const base = OMAN_PRICE_PROFILE_24H[h];
    const uncertainty = base * 0.05 * (i + 1);
    forecast.push(base);
    upperBand.push(base + uncertainty);
    lowerBand.push(Math.max(4.0, base - uncertainty));
  }
  return { forecast, upperBand, lowerBand };
}

export type PriceLevel = "VERY_CHEAP" | "CHEAP" | "MODERATE" | "EXPENSIVE" | "PEAK";

export function classifyPrice(price: number): PriceLevel {
  if (price < 5.5) return "VERY_CHEAP";
  if (price < 7.5) return "CHEAP";
  if (price < 10.0) return "MODERATE";
  if (price < 14.0) return "EXPENSIVE";
  return "PEAK";
}
