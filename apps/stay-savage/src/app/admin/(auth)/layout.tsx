import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('ecom_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
