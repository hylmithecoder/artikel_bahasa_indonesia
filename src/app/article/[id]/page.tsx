import { getContentById } from "@/services/get"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentSection } from "../../globalvariable"
import Navbar from "@/components/navbar"
import { getSession } from "@/actions/auth"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const article = await getContentById(Number(id))
    
    if (!article) return { title: "Article Not Found" }

    let parsedContent: ContentSection[] = []
    try {
        parsedContent = typeof article.content === "string" ? JSON.parse(article.content) : article.content
    } catch (e) {}

    let parsedDocs: string[] = []
    try {
        parsedDocs = typeof article.documentation === "string" ? JSON.parse(article.documentation) : article.documentation
    } catch (e) {}

    // Find thumbnail
    let thumbnailUrl = ""
    for (const sec of parsedContent) {
        if (sec.file && sec.file.length > 0) {
            thumbnailUrl = sec.file[0]
            break
        }
    }
    if (!thumbnailUrl && parsedDocs && parsedDocs.length > 0) {
        thumbnailUrl = parsedDocs[0]
    }

    const snippet = parsedContent.length > 0 
        ? parsedContent[0].content.replace(/<[^>]+>/g, '').substring(0, 160) + "..."
        : "Read this article on TRPL 2C"

    return {
        title: article.title,
        description: snippet,
        openGraph: {
            title: article.title,
            description: snippet,
            images: thumbnailUrl ? [thumbnailUrl] : [],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: snippet,
            images: thumbnailUrl ? [thumbnailUrl] : [],
        }
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    const { id } = await params
    const article = await getContentById(Number(id))

    if (!article) {
        notFound()
    }

    let parsedContent: ContentSection[] = []
    let parsedDocumentation: string[] = []

    try {
        parsedContent = typeof article.content === "string" ? JSON.parse(article.content) : article.content
    } catch (e) {
        console.error("Failed to parse content JSON", e)
    }

    try {
        parsedDocumentation = typeof article.documentation === "string" ? JSON.parse(article.documentation) : article.documentation
    } catch (e) {
        console.error("Failed to parse documentation JSON", e)
    }

    return (
        <>
            <Navbar isDashboard={false} session={session}/>
            <div className="min-h-screen text-white p-6 md:p-12 relative z-10 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 glass-panel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Back to Home
                </Link>
            </div>

            <article className="glass-panel p-8 md:p-12 rounded-3xl">
                <header className="mb-10 text-center">
                    <div className="inline-block bg-white/10 border border-white/20 text-white/70 text-sm py-1 px-3 rounded-full mb-4">
                        {new Date(article.updated_at || Date.now()).toLocaleDateString("id-ID", {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })} · {new Date(article.updated_at || Date.now()).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                        {article.title}
                    </h1>
                    <div className="flex justify-end mt-2">
                        <span className="text-white/40 text-sm italic">
                            Created by <span className="text-white/70 font-semibold not-italic uppercase tracking-wide border-b border-white/10">{article.created_by}</span>
                        </span>
                    </div>
                </header>

                <div className="prose prose-invert prose-lg max-w-none mb-12">
                    {parsedContent.map((section, idx) => (
                        <div key={idx} className="mb-12">
                            {/* Render HTML Content */}
                            <div 
                                className="text-white/90 leading-relaxed mb-6 space-y-4"
                                dangerouslySetInnerHTML={{ __html: section.content }} 
                            />
                            {/* Render Files */}
                            {section.file && section.file.length > 0 && (
                                <div className="grid gap-6 mt-8">
                                    {section.file.map((fileUrl, fileIdx) => {
                                        const isVideo = /\.(mp4|webm|ogg)$/i.test(fileUrl);
                                        return (
                                            <div key={fileIdx} className="w-full rounded-2xl overflow-hidden glass-panel border border-white/20">
                                                {isVideo ? (
                                                    <video 
                                                        src={fileUrl} 
                                                        controls
                                                        className="w-full h-auto max-h-[70vh] object-contain bg-black/50"
                                                    />
                                                ) : (
                                                    <img 
                                                        src={fileUrl} 
                                                        alt={`Media ${fileIdx + 1} for section ${idx + 1}`}
                                                        className="w-full h-auto max-h-[70vh] object-contain"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {parsedDocumentation && parsedDocumentation.length > 0 && (
                    <div className="border-t border-white/10 pt-8 mt-12 bg-white/5 -mx-8 md:-mx-12 px-8 md:px-12 -mb-8 md:-mb-12 pb-8 md:pb-12 rounded-b-3xl">
                        <h3 className="text-2xl font-bold mb-6 text-white text-center">Documentation</h3>
                        
                        <div className="grid grid-cols-1 gap-8">
                            {parsedDocumentation.map((docUrl, idx) => {
                                const isVideo = /\.(mp4|webm|ogg)$/i.test(docUrl);
                                return (
                                    <div key={idx} className="w-full rounded-2xl overflow-hidden glass-panel border border-white/20 flex justify-center bg-black/20">
                                        {isVideo ? (
                                            <video 
                                                src={docUrl} 
                                                controls
                                                className="max-w-full h-auto max-h-[70vh] object-contain"
                                            />
                                        ) : (
                                            <img 
                                                src={docUrl} 
                                                alt={`Documentation Media ${idx + 1}`}
                                                className="max-w-full h-auto max-h-[70vh] object-contain"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </article>
        </div>
        </>
    )
}
