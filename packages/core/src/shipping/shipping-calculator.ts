import type { ShippingZone, ShippingRate, ShippingCalculationInput } from '../types/shipping.js';
import type { Money } from '../types/common.js';

/** Find the matching shipping zone for a given address */
export function findMatchingZone(
  zones: ShippingZone[],
  countryCode: string,
  provinceCode?: string,
): ShippingZone | null {
  // Try province-level match first
  if (provinceCode) {
    const provinceMatch = zones.find(
      (z) => z.countries.includes(countryCode) && z.provinces.includes(provinceCode),
    );
    if (provinceMatch) return provinceMatch;
  }

  // Country-level match
  const countryMatch = zones.find(
    (z) => z.countries.includes(countryCode) && z.provinces.length === 0,
  );
  if (countryMatch) return countryMatch;

  // Fallback: "rest of world" zone (empty countries array = matches all)
  return zones.find((z) => z.countries.length === 0) ?? null;
}

/** Get available shipping rates for a zone given cart weight and subtotal */
export function getAvailableRates(
  zone: ShippingZone,
  input: ShippingCalculationInput,
): ShippingRate[] {
  if (!zone.rates) return [];

  return zone.rates.filter((rate) => {
    if (!rate.conditions) return true;

    const { minWeight, maxWeight, minPrice, maxPrice } = rate.conditions;

    if (rate.type === 'weight_based') {
      if (minWeight !== undefined && input.totalWeight < minWeight) return false;
      if (maxWeight !== undefined && input.totalWeight > maxWeight) return false;
    }

    if (rate.type === 'price_based') {
      if (minPrice !== undefined && input.subtotal < minPrice) return false;
      if (maxPrice !== undefined && input.subtotal > maxPrice) return false;
    }

    return true;
  });
}

/** Calculate shipping cost for a specific rate */
export function calculateShippingCost(rate: ShippingRate): Money {
  // For flat rates, the price is the cost
  // Weight-based and price-based rates also use the stored price
  // (conditions determine eligibility, price is the cost when eligible)
  return rate.price;
}

/** Get the cheapest available shipping rate */
export function getCheapestRate(rates: ShippingRate[]): ShippingRate | null {
  if (rates.length === 0) return null;
  return rates.reduce((cheapest, rate) => (rate.price < cheapest.price ? rate : cheapest));
}
