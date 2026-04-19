export type EmailConfig = SesEmailConfig | ResendEmailConfig;

export interface SesEmailConfig {
  provider: 'ses';
  region: string;
  fromEmail: string;
  fromName?: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface ResendEmailConfig {
  provider: 'resend';
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}
