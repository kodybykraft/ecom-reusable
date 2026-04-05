export function adminRoutes(basePath: string) {
  const p = basePath.replace(/\/$/, '');
  return {
    dashboard: p,
    products: `${p}/products`,
    productNew: `${p}/products/new`,
    productEdit: (id: string) => `${p}/products/${id}`,
    orders: `${p}/orders`,
    orderDetail: (id: string) => `${p}/orders/${id}`,
    customers: `${p}/customers`,
    customerDetail: (id: string) => `${p}/customers/${id}`,
    discounts: `${p}/discounts`,
    discountNew: `${p}/discounts/new`,
    discountEdit: (id: string) => `${p}/discounts/${id}`,
    categories: `${p}/categories`,
    settings: `${p}/settings`,
    settingsShipping: `${p}/settings/shipping`,
    settingsTax: `${p}/settings/tax`,
    settingsPayments: `${p}/settings/payments`,
    settingsStaff: `${p}/settings/staff`,
    activity: `${p}/activity`,
  };
}
