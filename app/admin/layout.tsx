import AdminLayout from '@/components/admin/AdminLayout'
import ChildrenInterface from '@/interface/children.interface'
import { FC } from 'react'

const AdminLayoutRouter:FC<ChildrenInterface> = ({children}) => {
  return (
    <AdminLayout>{children}</AdminLayout>
  )
}

export default AdminLayoutRouter