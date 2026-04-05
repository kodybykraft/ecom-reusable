import type { Money, ShippingRateType } from './common.js';

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  provinces: string[];
  rates?: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  zoneId: string;
  name: string;
  type: ShippingRateType;
  price: Money;
  conditions: ShippingRateCondition | null;
}

export interface ShippingRateCondition {
  minWeight?: number;
  maxWeight?: number;
  minPrice?: Money;
  maxPrice?: Money;
}

export interface ShippingCalculationInput {
  countryCode: string;
  provinceCode?: string;
  totalWeight: number;
  subtotal: Money;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // decimal, e.g. 0.08 for 8%
  country: string;
  province: string | null;
  priority: number;
  isCompound: boolean;
  isShipping: boolean;
}

export interface TaxCalculationInput {
  subtotal: Money;
  shippingTotal: Money;
  countryCode: string;
  provinceCode?: string;
}
