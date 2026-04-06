'use server';

import { getEcom } from '../create-ecom.js';

export async function login(email: string, password: string) {
  const ecom = getEcom();
  if (!ecom.auth.login) {
    throw new Error('Built-in auth is not enabled. Configure a custom auth adapter with login support.');
  }
  return ecom.auth.login(email, password);
}

export async function register(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const ecom = getEcom();
  if (!ecom.auth.register) {
    throw new Error('Built-in auth is not enabled. Configure a custom auth adapter with register support.');
  }
  return ecom.auth.register(input);
}

export async function logout(token: string) {
  const ecom = getEcom();
  if (!ecom.auth.logout) {
    throw new Error('Built-in auth is not enabled. Configure a custom auth adapter with logout support.');
  }
  return ecom.auth.logout(token);
}

export async function validateToken(token: string) {
  const ecom = getEcom();
  return ecom.auth.validateToken(token);
}
