import { eq, desc } from 'drizzle-orm';
import { emailTemplates } from '@ecom/db';
import type { Database } from '@ecom/db';

export class TemplateService {
  constructor(private db: Database) {}

  async list() {
    return this.db.query.emailTemplates.findMany({ orderBy: desc(emailTemplates.createdAt) });
  }

  async getById(id: string) {
    return this.db.query.emailTemplates.findFirst({ where: eq(emailTemplates.id, id) });
  }

  async create(input: {
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    category?: string;
  }) {
    // Extract variables from HTML ({{variableName}} patterns)
    const variableMatches = input.htmlContent.match(/\{\{(\w+)\}\}/g) ?? [];
    const variables = [...new Set(variableMatches.map((m) => m.replace(/\{\{|\}\}/g, '')))];

    const [template] = await this.db.insert(emailTemplates).values({
      name: input.name,
      subject: input.subject,
      htmlContent: input.htmlContent,
      textContent: input.textContent ?? null,
      variables,
      category: input.category ?? null,
    }).returning();

    return template;
  }

  async update(id: string, input: Partial<{
    name: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    category: string;
  }>) {
    const updateData: Record<string, unknown> = {};
    if (input.name) updateData.name = input.name;
    if (input.subject) updateData.subject = input.subject;
    if (input.htmlContent) {
      updateData.htmlContent = input.htmlContent;
      const variableMatches = input.htmlContent.match(/\{\{(\w+)\}\}/g) ?? [];
      updateData.variables = [...new Set(variableMatches.map((m) => m.replace(/\{\{|\}\}/g, '')))];
    }
    if (input.textContent !== undefined) updateData.textContent = input.textContent;
    if (input.category !== undefined) updateData.category = input.category;

    await this.db.update(emailTemplates).set(updateData).where(eq(emailTemplates.id, id));
    return this.getById(id);
  }

  async renderPreview(id: string, data: Record<string, string> = {}) {
    const template = await this.getById(id);
    if (!template) return null;

    let html = template.htmlContent;
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    return { subject: template.subject, html };
  }

  async delete(id: string) {
    await this.db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  }
}
