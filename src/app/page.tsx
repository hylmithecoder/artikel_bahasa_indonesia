import { getContents } from "@/services/get"
import Link from "next/link"
import { ContentSection } from "./globalvariable"
import Navbar from "@/components/navbar"
import { getSession } from "@/actions/auth"

export default async function HomePage() {
    const session = await getSession()
    const contents = await getContents()

    return (
        <div className="min-h-screen text-white">
            <Navbar session={session} isDashboard={false}/>
            <main className="max-w-5xl mx-auto p-6 md:p-12 relative z-10">
                <div className="py-16 md:py-24 flex flex-col items-center text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs tracking-widest uppercase font-medium mb-6">
                        Politeknik Negeri Medan
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Artikel <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">TRPL 2C</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl font-light leading-relaxed">
                        Website ini adalah wadah kumpulan artikel yang dikerjakan oleh mahasiswa<br className="hidden md:block" /> Program Studi Teknik Rekayasa Perangkat Lunak, Kelas 2C.
                    </p>
                </div>
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Latest Articles</h2>
                            <p className="text-white/60">Discover the latest knowledge base</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contents.map((article) => {
                            let parsedContent: ContentSection[] = []
                            try {
                                parsedContent = typeof article.content === "string" ? JSON.parse(article.content) : article.content
                            } catch (e) {
                                // Fallback
                            }
                            
                            let parsedDocs: string[] = []
                            try {
                                parsedDocs = typeof article.documentation === "string" ? JSON.parse(article.documentation) : article.documentation
                            } catch (e) {
                                // Fallback
                            }

                            // Find first available media for thumbnail
                            let thumbnailUrl = null
                            for (const sec of parsedContent) {
                                if (sec.file && sec.file.length > 0) {
                                    thumbnailUrl = sec.file[0]
                                    break
                                }
                            }
                            if (!thumbnailUrl && parsedDocs && parsedDocs.length > 0) {
                                thumbnailUrl = parsedDocs[0]
                            }

                            const isVideoThumbnail = thumbnailUrl ? /\.(mp4|webm|ogg)$/i.test(thumbnailUrl) : false;

                            return (
                                <div key={article.id} className="glass-panel p-6 rounded-2xl flex flex-col hover:bg-white/20 transition-all duration-300">
                                    {thumbnailUrl && (
                                        <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-black/20 border border-white/10 shrink-0">
                                            {isVideoThumbnail ? (
                                                <video 
                                                    src={thumbnailUrl} 
                                                    className="w-full h-full object-cover opacity-80"
                                                    muted
                                                    loop
                                                    playsInline
                                                    autoPlay // Auto-play muted video as thumbnail
                                                />
                                            ) : (
                                                <img 
                                                    src={thumbnailUrl} 
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs text-white/50 mb-3">
                                        <span>
                                            {new Date(article.created_at || Date.now()).toLocaleDateString("id-ID", {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                                            {article.created_by}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
                                    
                                    <p className="text-white/70 mb-4 line-clamp-3 flex-grow">
                                        {parsedContent.length > 0 ? parsedContent[0].content.replace(/<[^>]+>/g, '') : "No snippet available."}
                                    </p>
                                    
                                    <Link 
                                        href={`/article/${article.id}`} 
                                        className="mt-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium py-2 px-4 rounded-xl text-center transition-all"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            )
                        })}

                        {contents.length === 0 && (
                            <div className="col-span-full text-center py-12 glass-panel rounded-2xl backdrop-blur-md border border-white/10">
                                <div className="text-6xl mb-4 opacity-50">📚</div>
                                <h3 className="text-xl text-white/80 font-medium">No articles yet</h3>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
