import { getContentById } from "@/services/get"
import Link from "next/link"
import { notFound } from "next/navigation"
import DeleteConfirm from "./DeleteConfirm"

export default async function DeleteArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const article = await getContentById(Number(id))

    if (!article) {
        notFound()
    }

    return (
        <div className="max-w-xl mx-auto mt-20">
            <div className="glass-panel p-8 rounded-2xl border-red-500/30 text-center">
                <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Delete Article?</h2>
                <p className="text-white/70 mb-6">
                    Are you sure you want to delete the article <br/>
                    <strong className="text-white">"{article.title}"</strong>?<br/> 
                    This action cannot be undone.
                </p>

                <DeleteConfirm id={article.id} />
                
                <div className="mt-6">
                    <Link 
                        href="/dashboard/admin"
                        className="text-white/50 border-b border-transparent hover:border-white/50 hover:text-white/80 transition-all text-sm pb-1"
                    >
                        Keep Article & Go Back
                    </Link>
                </div>
            </div>
        </div>
    )
}
