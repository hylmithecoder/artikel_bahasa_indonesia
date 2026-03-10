import CreateArticleForm from "./CreateArticleForm"
import Link from "next/link"

export default function CreateArticlePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/dashboard" className="p-2 rounded-full glass-panel hover:bg-white/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold text-white">Create New Article</h2>
                    <p className="text-white/60">Publish a new structured article with media</p>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
                <CreateArticleForm />
            </div>
        </div>
    )
}
