import Navbar from "@/components/navbar"
import {getSession} from "@/actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()

    if (!session){
        redirect("/login")
    }

    return (
        <div className="min-h-screen text-white">
            <Navbar session={session} isDashboard={true}/>
            <main className="max-w-5xl mx-auto p-6 md:p-12 relative z-10">
                {children}
            </main>
        </div>
    )
}
