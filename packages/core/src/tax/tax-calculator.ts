import type { TaxRate, TaxCalculationInput } from '../types/shipping.js';
import type { Money } from '../types/common.js';
import type { TaxLine } from '../types/order.js';

/** Calculate tax for a given amount and matching tax rates */
export function calculateTax(
  input: TaxCalculationInput,
  taxRates: TaxRate[],
): { total: Money; lines: TaxLine[] } {
  const matchingRates = findMatchingRates(taxRates, input.countryCode, input.provinceCode);

  if (matchingRates.length === 0) {
    return { total: 0, lines: [] };
  }

  // Sort by priority for compound tax calculation
  const sorted = [...matchingRates].sort((a, b) => a.priority - b.priority);

  let runningTotal = input.subtotal;
  let taxTotal = 0;
  const lines: TaxLine[] = [];

  for (const rate of sorted) {
    const taxableAmount = rate.isCompound ? runningTotal : input.subtotal;
    let shippingTax = 0;

    if (rate.isShipping && input.shippingTotal > 0) {
      shippingTax = Math.round(input.shippingTotal * rate.rate);
    }

    const itemTax = Math.round(taxableAmount * rate.rate);
    const totalTax = itemTax + shippingTax;

    lines.push({
      title: rate.name,
      rate: rate.rate,
      amount: totalTax,
    });

    taxTotal += totalTax;
    runningTotal += totalTax;
  }

  return { total: taxTotal, lines };
}

/** Find tax rates matching a given country/province */
function findMatchingRates(
  rates: TaxRate[],
  countryCode: string,
  provinceCode?: string,
): TaxRate[] {
  return rates.filter((rate) => {
    if (rate.country !== countryCode) return false;
    if (rate.province && provinceCode && rate.province !== provinceCode) return false;
    return true;
  });
}

/** Calculate tax for a single line item amount */
export function calculateLineTax(amount: Money, rates: TaxRate[]): Money {
  let total = 0;
  for (const rate of rates) {
    total += Math.round(amount * rate.rate);
  }
  return total;
}
