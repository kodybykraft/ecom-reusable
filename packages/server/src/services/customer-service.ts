import { eq, like, and, sql, desc } from 'drizzle-orm';
import { customers, customerAddresses } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { CreateCustomerInput, CreateAddressInput, PaginationInput } from '@ecom/core';
import { NotFoundError } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class CustomerService {
  constructor(private db: Database) {}

  async list(search?: string, pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const where = search ? like(customers.email, `%${search}%`) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.customers.findMany({
        where,
        with: { addresses: true },
        limit: pageSize,
        offset,
        orderBy: desc(customers.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(customers).where(where),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const customer = await this.db.query.customers.findFirst({
      where: eq(customers.id, id),
      with: { addresses: true },
    });
    if (!customer) throw new NotFoundError('Customer', id);
    return customer;
  }

  async getByEmail(email: string) {
    return this.db.query.customers.findFirst({
      where: eq(customers.email, email),
      with: { addresses: true },
    });
  }

  async create(input: CreateCustomerInput) {
    const [customer] = await this.db
      .insert(customers)
      .values({
        email: input.email,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        phone: input.phone ?? null,
        acceptsMarketing: input.acceptsMarketing ?? false,
        metadata: input.metadata ?? null,
      })
      .returning();

    await eventBus.emit('customer.created', { customerId: customer.id });
    return this.getById(customer.id);
  }

  async update(id: string, data: Partial<CreateCustomerInput>) {
    await this.getById(id);
    await this.db.update(customers).set(data).where(eq(customers.id, id));
    await eventBus.emit('customer.updated', { customerId: id });
    return this.getById(id);
  }

  async addAddress(customerId: string, input: CreateAddressInput) {
    await this.getById(customerId);

    if (input.isDefault) {
      await this.db
        .update(customerAddresses)
        .set({ isDefault: false })
        .where(eq(customerAddresses.customerId, customerId));
    }

    const [address] = await this.db
      .insert(customerAddresses)
      .values({ customerId, ...input, isDefault: input.isDefault ?? false })
      .returning();

    return address;
  }

  async deleteAddress(customerId: string, addressId: string) {
    await this.db
      .delete(customerAddresses)
      .where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.customerId, customerId)));
  }
}
