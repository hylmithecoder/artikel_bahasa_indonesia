"use client";

import { logout } from "@/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";

export default function Navbar({ session, isDashboard }: { session: any; isDashboard: boolean }) {
    const router = useRouter();

    if (!session && isDashboard) {
        redirect("/login");
    }

    const handleDashboardClick = () => {
        if (session?.isAdmin) {
            router.push("/dashboard/admin");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-black/40 border-b border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-4">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    <h1 className="text-xl font-bold tracking-tight text-white cursor-pointer hover:text-white/90 transition-colors">
                        Artikel Bahasa <span className="text-red-500 font-normal">Indonesia</span>
                    </h1>
                </Link>

                {session && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-md border ${
                        session.isAdmin 
                            ? "bg-red-500/10 border-red-500/20 text-red-400" 
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    }`}>
                        {session.isAdmin ? "Admin" : "User"}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-6 text-sm font-medium">
                {session ? (
                    <>
                        <span className="text-white/80 hidden sm:inline-block">Hello, {session.username}</span>
                        <button 
                            onClick={handleDashboardClick} 
                            className="cursor-pointer bg-white/5 hover:bg-blue-500/20 hover:text-blue-300 transition-all px-5 py-2.5 rounded-full text-white/90 border border-white/10 hover:border-blue-500/30"
                        >
                            Dashboard
                        </button>
                        <form action={logout}>
                            <button className="cursor-pointer bg-white/5 hover:bg-red-500/20 hover:text-red-300 transition-all px-5 py-2.5 rounded-full text-white/90 border border-white/10 hover:border-red-500/30">
                                Logout
                            </button>
                        </form>
                    </>
                ) : (
                    <Link 
                        href="/login" 
                        className="cursor-pointer bg-white/5 hover:bg-blue-500/20 hover:text-blue-300 transition-all px-5 py-2.5 rounded-full text-white/90 border border-white/10 hover:border-blue-500/30"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}