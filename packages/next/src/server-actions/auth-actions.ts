'use server';

import { getEcom } from '../create-ecom.js';

export async function login(email: string, password: string) {
  const ecom = getEcom();
  return ecom.auth.login(email, password);
}

export async function register(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const ecom = getEcom();
  return ecom.auth.register(input);
}

export async function logout(token: string) {
  const ecom = getEcom();
  return ecom.auth.logout(token);
}

export async function validateToken(token: string) {
  const ecom = getEcom();
  return ecom.auth.validateToken(token);
}
