import { Metadata } from 'next';
// import { AdminSidebar } from '@/components/admin/admin-sidebar';
// import { AdminHeader } from '@/components/admin/admin-header';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Admin Dashboard | Advanced News Platform',
  description: 'Manage your news platform with comprehensive admin tools.',
  robots: 'noindex, nofollow',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <AdminHeader /> */}
      <div className="flex">
        {/* <AdminSidebar /> */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}