import { eq, desc, sql } from 'drizzle-orm';
import { importJobs, exportJobs } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError } from '@ecom/core';
import type { PaginationInput } from '@ecom/core';

export class ImportExportService {
  constructor(private db: Database) {}

  async listImportJobs(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.importJobs.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(importJobs.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(importJobs),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async listExportJobs(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.exportJobs.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(exportJobs.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(exportJobs),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async createImportJob(input: {
    type: string;
    fileName: string;
    columnMapping?: unknown;
    userId?: string;
  }) {
    const [job] = await this.db
      .insert(importJobs)
      .values({
        type: input.type,
        fileName: input.fileName,
        columnMapping: input.columnMapping,
        userId: input.userId,
      })
      .returning();
    return job;
  }

  async updateImportProgress(id: string, data: {
    processedRows?: number;
    successCount?: number;
    errorCount?: number;
    errors?: unknown;
    status?: string;
  }) {
    const existing = await this.db.query.importJobs.findFirst({
      where: eq(importJobs.id, id),
    });
    if (!existing) throw new NotFoundError('ImportJob', id);

    const updateData: Record<string, unknown> = {};
    if (data.processedRows !== undefined) updateData.processedRows = data.processedRows;
    if (data.successCount !== undefined) updateData.successCount = data.successCount;
    if (data.errorCount !== undefined) updateData.errorCount = data.errorCount;
    if (data.errors !== undefined) updateData.errors = data.errors;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'processing' && !existing.startedAt) updateData.startedAt = new Date();
      if (data.status === 'completed' || data.status === 'failed') updateData.completedAt = new Date();
    }

    const [updated] = await this.db
      .update(importJobs)
      .set(updateData)
      .where(eq(importJobs.id, id))
      .returning();
    return updated;
  }

  async createExportJob(input: {
    type: string;
    filters?: unknown;
    userId?: string;
  }) {
    const [job] = await this.db
      .insert(exportJobs)
      .values({
        type: input.type,
        filters: input.filters,
        userId: input.userId,
      })
      .returning();
    return job;
  }

  async updateExportProgress(id: string, data: {
    totalRows?: number;
    fileName?: string;
    fileUrl?: string;
    status?: string;
  }) {
    const existing = await this.db.query.exportJobs.findFirst({
      where: eq(exportJobs.id, id),
    });
    if (!existing) throw new NotFoundError('ExportJob', id);

    const updateData: Record<string, unknown> = {};
    if (data.totalRows !== undefined) updateData.totalRows = data.totalRows;
    if (data.fileName !== undefined) updateData.fileName = data.fileName;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'processing' && !existing.startedAt) updateData.startedAt = new Date();
      if (data.status === 'completed' || data.status === 'failed') updateData.completedAt = new Date();
    }

    const [updated] = await this.db
      .update(exportJobs)
      .set(updateData)
      .where(eq(exportJobs.id, id))
      .returning();
    return updated;
  }

  async getJobStatus(id: string, jobType: 'import' | 'export') {
    if (jobType === 'import') {
      const job = await this.db.query.importJobs.findFirst({
        where: eq(importJobs.id, id),
      });
      if (!job) throw new NotFoundError('ImportJob', id);
      return job;
    } else {
      const job = await this.db.query.exportJobs.findFirst({
        where: eq(exportJobs.id, id),
      });
      if (!job) throw new NotFoundError('ExportJob', id);
      return job;
    }
  }
}
