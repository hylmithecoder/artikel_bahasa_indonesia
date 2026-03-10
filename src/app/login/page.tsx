"use client"

import { useActionState } from "react"
import { login } from "@/actions/auth"

export default function LoginPage() {
    // Note: useActionState wraps the server action for forms
    const [state, formAction, pending] = useActionState(login, null)

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8 rounded-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-sm opacity-80">Sign in to your account</p>
                </div>
                
                <form action={formAction} className="flex flex-col gap-5">
                    {state?.error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                            {state.error}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium ml-1">Username</label>
                        <input 
                            name="username"
                            type="text" 
                            required
                            className="bg-white/5 border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium ml-1">Password</label>
                        <input 
                            name="password"
                            type="password" 
                            required
                            className="bg-white/5 border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={pending}
                        className="mt-4 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pending ? "Signing in..." : "Sign In"}
                    </button>
                    
                    <div className="text-center text-xs opacity-60 mt-4">
                        For admin access, use an admin username.
                    </div>
                </form>
            </div>
        </div>
    )
}
