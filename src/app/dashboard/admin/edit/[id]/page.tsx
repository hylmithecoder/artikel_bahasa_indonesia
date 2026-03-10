import { getContentById } from "@/services/get"
import Link from "next/link"
import { notFound } from "next/navigation"
import EditForm from "./EditForm"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const article = await getContentById(Number(id))

    if (!article) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/dashboard/admin" className="p-2 rounded-full glass-panel hover:bg-white/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">Edit Article</h2>
                    <p className="text-white/60">Update the information for this article</p>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <EditForm article={article} />
            </div>
        </div>
    )
}
