"use client"

import { useActionState, useEffect } from "react"
import { addAccountAction, deleteAccountAction } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function UserActions({ actionType = "create", userId }: { actionType?: "create" | "delete", userId?: number }) {
    const router = useRouter()
    const [state, formAction, pending] = useActionState(addAccountAction, null)
    const [isPendingDelete, startTransition] = useTransition()

    useEffect(() => {
        if (state?.success) {
            router.refresh()
        }
    }, [state, router])

    const handleDelete = () => {
        if (!userId) return
        startTransition(async () => {
            await deleteAccountAction(userId)
            router.refresh()
        })
    }

    if (actionType === "delete") {
        return (
            <button 
                onClick={handleDelete}
                disabled={isPendingDelete}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-50"
            >
                {isPendingDelete ? "Deleting..." : "Delete"}
            </button>
        )
    }

    return (
        <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg text-sm">
                    {state.error}
                </div>
            )}
            
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium ml-1 text-white/70">Username</label>
                <input 
                    name="username"
                    type="text" 
                    required
                    className="bg-black/20 border border-white/10 px-3 py-2 rounded-xl outline-none focus:border-blue-400 text-white placeholder:text-white/30 text-sm"
                    placeholder="newuser"
                />
            </div>
            
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium ml-1 text-white/70">Password</label>
                <input 
                    name="password"
                    type="password" 
                    required
                    className="bg-black/20 border border-white/10 px-3 py-2 rounded-xl outline-none focus:border-blue-400 text-white placeholder:text-white/30 text-sm"
                    placeholder="••••••••"
                />
            </div>
            
            <button 
                type="submit" 
                disabled={pending}
                className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-xl shadow-lg border border-blue-400 transition-all disabled:opacity-50 text-sm"
            >
                {pending ? "Adding..." : "Create Account"}
            </button>
        </form>
    )
}
