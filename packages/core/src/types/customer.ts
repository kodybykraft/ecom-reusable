export interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string | null;
  provinceCode: string | null;
  country: string;
  countryCode: string;
  zip: string;
  phone: string | null;
  isDefault: boolean;
}

export interface CreateCustomerInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateAddressInput {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  provinceCode?: string;
  country: string;
  countryCode: string;
  zip: string;
  phone?: string;
  isDefault?: boolean;
}
