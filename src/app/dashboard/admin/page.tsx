import { getContents } from "@/services/get"
import Link from "next/link"

export default async function AdminDashboardPage() {
    const contents = await getContents()

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h2>
                    <p className="text-white/60">Manage your articles efficiently</p>
                </div>
                <div className="flex gap-4">
                    <Link 
                        href="/dashboard/admin/users" 
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2"
                    >
                        Manage Users
                    </Link>
                    <Link 
                        href="/dashboard/create" 
                        className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg border border-blue-400 transition-all flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span> Create Article
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((article) => {
                    let parsedContent: any[] = []
                    try {
                        parsedContent = typeof article.content === "string" ? JSON.parse(article.content) : article.content
                    } catch (e) {
                        // Fallback
                    }

                    return (
                        <div key={article.id} className="glass-panel p-6 rounded-2xl flex flex-col group hover:border-white/40 transition-all">
                            <div className="flex justify-between items-center text-xs text-white/50 mb-3">
                                <span>
                                    {new Date(article.updated_at || Date.now()).toLocaleDateString("id-ID", {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                                    {article.created_by}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-white/70 mb-6 line-clamp-3">
                                {parsedContent && parsedContent.length > 0 ? parsedContent[0].content.replace(/<[^>]+>/g, '') : "No snippet available."}
                            </p>
                            
                            <div className="mt-auto flex gap-2 pt-4 border-t border-white/10">
                                <Link 
                                    href={`/article/${article.id}`} 
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 px-3 rounded-lg text-center transition-all"
                                >
                                    View
                                </Link>
                                <Link 
                                    href={`/dashboard/admin/edit/${article.id}`} 
                                    className="flex-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/30 text-xs font-medium py-2 px-3 rounded-lg text-center transition-all"
                                >
                                    Edit
                                </Link>
                                <Link 
                                    href={`/dashboard/admin/delete/${article.id}`} 
                                    className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 text-xs font-medium py-2 px-3 rounded-lg text-center transition-all"
                                >
                                    Delete
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {contents.length === 0 && (
                <div className="text-center py-16 glass-panel rounded-2xl border border-white/10">
                    <div className="text-6xl mb-4 opacity-30">🚀</div>
                    <h3 className="text-xl text-white/60 mb-4 font-medium">Ready to create your first article?</h3>
                    <Link 
                        href="/dashboard/admin/create" 
                        className="inline-block bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-xl transition-all"
                    >
                        Create Now
                    </Link>
                </div>
            )}
        </div>
    )
}
