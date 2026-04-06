/**
 * Validates required environment variables at startup.
 * Import this in your root layout or instrumentation file.
 */

const REQUIRED_VARS = ['DATABASE_URL'] as const;

const OPTIONAL_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'AWS_SES_REGION',
  'AWS_SES_FROM_EMAIL',
  'ADMIN_SECRET',
] as const;

export interface EnvCheckResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function checkEnvironment(): EnvCheckResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  for (const key of OPTIONAL_VARS) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }

  const valid = missing.length === 0;

  if (!valid) {
    console.error(
      `[ecom] Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  if (warnings.length > 0) {
    console.warn(
      `[ecom] Missing optional environment variables (some features may be disabled): ${warnings.join(', ')}`,
    );
  }

  return { valid, missing, warnings };
}

/** Call at startup — throws if required vars are missing */
export function validateEnvironment(): void {
  const result = checkEnvironment();
  if (!result.valid) {
    throw new Error(
      `Missing required environment variables: ${result.missing.join(', ')}. ` +
        'Check your .env file or deployment configuration.',
    );
  }
}
