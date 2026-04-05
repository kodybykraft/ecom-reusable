import { eq } from 'drizzle-orm';
import { users, sessions } from '@ecom/db';
import type { Database } from '@ecom/db';
import { UnauthorizedError, ValidationError } from '@ecom/core';
import type { User } from '../context.js';

// Simple hash for dev — in production use bcrypt/argon2 via integration adapter
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

function generateToken(): string {
  return crypto.randomUUID() + '-' + crypto.randomUUID();
}

export class AuthService {
  constructor(private db: Database) {}

  async register(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'admin' | 'staff' | 'customer';
  }): Promise<{ user: User; token: string }> {
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, input.email),
    });
    if (existing) {
      throw new ValidationError('Email already registered', 'email');
    }

    const passwordHash = await hashPassword(input.password);
    const [user] = await this.db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        role: input.role ?? 'customer',
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
      })
      .returning();

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await this.db.insert(sessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as User['role'],
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.db.insert(sessions).values({ userId: user.id, token, expiresAt });
    await this.db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as User['role'],
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  async validateToken(token: string): Promise<User | null> {
    const session = await this.db.query.sessions.findFirst({
      where: eq(sessions.token, token),
      with: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const { user } = session;
    if (!user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role as User['role'],
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async logout(token: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.token, token));
  }
}
