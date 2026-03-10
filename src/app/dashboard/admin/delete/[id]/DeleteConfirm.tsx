"use client"

import { useTransition } from "react"
import { deleteArticleAction } from "@/actions/article"

export default function DeleteConfirm({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            await deleteArticleAction(id)
        })
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={isPending}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/20 border border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? "Deleting..." : "Yes, Delete Article"}
        </button>
    )
}
