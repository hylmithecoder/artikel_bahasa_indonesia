import { getAccounts } from "@/services/get"
import Link from "next/link"
import UserActions from "./UserActions"

export default async function UserManagementPage() {
    const accounts = await getAccounts()

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin" className="p-2 rounded-full glass-panel hover:bg-white/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Manage Users</h2>
                        <p className="text-white/60">Create or remove author accounts</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side: Create User Form */}
                <div className="md:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 sticky top-24">
                        <h3 className="text-xl font-bold mb-4 text-white">Add New User</h3>
                        <UserActions />
                    </div>
                </div>

                {/* Right Side: User List */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">Existing Accounts ({accounts.length})</h3>
                    {accounts.map((user) => (
                        <div key={user.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors">
                                    {user.username}
                                    {user.username === 'admin' && (
                                        <span className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-md border border-red-500/30">Superadmin</span>
                                    )}
                                </div>
                                <div className="text-xs text-white/50">
                                    Created: {new Date(user.created_at || Date.now()).toLocaleDateString("id-ID")}
                                </div>
                            </div>
                            
                            {user.username !== 'admin' && (
                                <UserActions actionType="delete" userId={user.id} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
