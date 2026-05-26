import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SettingsForms from "@/components/dashboard/SettingsForms"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? ""
  const email = user.email ?? ""

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Paramètres</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>

      <SettingsForms fullName={fullName} email={email} />
    </div>
  )
}
