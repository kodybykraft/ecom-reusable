import { createEcom } from '@ecom/next';

export const ecom = createEcom({
  databaseUrl: process.env.DATABASE_URL!,
});
