import { Metadata } from 'next';
import AdminSidebar from '@/components/Admin/Sidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Tech Blog',
  description: 'Admin panel for managing blog posts',
  robots: 'noindex, nofollow',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}