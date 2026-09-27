import AdminGuard from '@/components/admin/AdminGuard'

export const metadata = {
  title: 'Admin - Souza Encanto'
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      {/* O design wrapper do painel administrativo vai aqui depois, como sidebar e topbar */}
      {children}
    </AdminGuard>
  )
}
