import { redirect } from "next/navigation"
import { requireAuth } from "../../../lib/auth"
import { connectToDatabase } from "../../../lib/mongodb"
import { User } from "../../../lib/models/user"


export default async function AdminDashboardPage() {
  const session = await requireAuth()

  // Check if user is an admin
  await connectToDatabase()
  const user = await User.findById(session.userId)

  if (!user || !user.isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your SkillSwap platform</p>
      {/* <AdminDashboard /> */}
    </div>
  )
}
