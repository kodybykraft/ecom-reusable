export interface AdminConfig {
  basePath: string; // e.g. '/admin'
  apiBase: string; // e.g. '/api/ecom'
  branding?: {
    title?: string;
    logo?: string;
  };
}

export const defaultConfig: AdminConfig = {
  basePath: '/admin',
  apiBase: '/api/ecom',
  branding: { title: 'E-Com Admin' },
};
