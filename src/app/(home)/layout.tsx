import { getCurrentUser } from "@/lib/user.action"
import { DashboardLayout } from "@/modules/home/ui/view/dashboard-layout"

interface LayoutProps {
    children: React.ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
    const user = await getCurrentUser()

    return (
        <DashboardLayout user={user}>
            {children}
        </DashboardLayout>
    )
}

export default Layout
