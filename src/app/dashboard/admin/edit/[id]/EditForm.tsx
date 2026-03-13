"use client"

import { useState, useEffect } from "react"
import { uploadFile } from "@/actions/upload"
import { editArticleAction } from "@/actions/article"
import Link from "next/link"
import { ContentModel, ContentSection } from "@/app/globalvariable"

export default function EditForm({ article }: { article: ContentModel }) {
    const [title, setTitle] = useState(article.title)
    const [sections, setSections] = useState<ContentSection[]>([])
    const [docFiles, setDocFiles] = useState<File[]>([])
    const [existingDocs, setExistingDocs] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        let parsedContent: ContentSection[] = []
        try {
            parsedContent = typeof article.content === "string" ? JSON.parse(article.content) : article.content
        } catch (e) {
            parsedContent = [{ content: article.content as string, file: [] }]
        }
        setSections(parsedContent.length > 0 ? parsedContent : [{ content: "", file: [] }])

        let parsedDocs: string[] = []
        try {
            parsedDocs = typeof article.documentation === "string" ? JSON.parse(article.documentation) : article.documentation
        } catch (e) {
            parsedDocs = article.documentation ? [article.documentation as string] : []
        }
        setExistingDocs(parsedDocs)
    }, [article])

    const handleAddSection = () => {
        setSections([...sections, { content: "", file: [] }])
    }

    const handleRemoveSection = (index: number) => {
        const newSections = [...sections]
        newSections.splice(index, 1)
        setSections(newSections)
    }

    const handleSectionContentChange = (index: number, content: string) => {
        const newSections = [...sections]
        newSections[index].content = content
        setSections(newSections)
    }

    const handleSectionFilesChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newSections = [...sections] as any[]
            // We append new files to be uploaded. existing files in 'file' array will be kept or overwritten
            // For simplicity in this demo, let's say selecting new files replaces existing ones for that section
            // In a real app we'd need a more complex UI to manage existing vs new files.
            newSections[index].file = [] // Clear existing since we are replacing
            newSections[index]._newFiles = Array.from(e.target.files)
            setSections(newSections)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            const uploadedSections = await Promise.all(
                sections.map(async (sec: any) => {
                    let fileUrls = sec.file || []
                    if (sec._newFiles && sec._newFiles.length > 0) {
                        const newUrls = await Promise.all(
                            sec._newFiles.map((f: File) => uploadFile(f))
                        )
                        fileUrls = newUrls
                    }
                    return {
                        content: sec.content,
                        file: fileUrls
                    }
                })
            )

            let finalDocs = [...existingDocs]
            if (docFiles.length > 0) {
                const newDocsUrls = await Promise.all(
                    docFiles.map(file => uploadFile(file))
                )
                finalDocs = newDocsUrls // Replacing for simplicity
            }

            const formData = new FormData()
            formData.append("id", article.id.toString())
            formData.append("title", title)
            formData.append("content", JSON.stringify(uploadedSections))
            formData.append("documentation", JSON.stringify(finalDocs))
            formData.append("user", article.created_by) // Send original author

            const result = await editArticleAction(null, formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch (err: any) {
            setError(err.message || "Failed to update article")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {error && (
                <div className="bg-red-500/20 text-red-200 p-4 rounded-xl text-center border border-red-500/50">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="text-xl font-semibold text-white">Article Title</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-black/20 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-400 text-lg"
                    placeholder="Enter an engaging title..."
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-xl font-semibold text-white">Content Sections</h3>
                    <button 
                        type="button" 
                        onClick={handleAddSection}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm transition"
                    >
                        + Add Section
                    </button>
                </div>
                
                {sections.map((section: any, idx) => (
                    <div key={idx} className="bg-white/5 p-6 rounded-2xl relative border border-white/10">
                        {sections.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => handleRemoveSection(idx)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        )}
                        <h4 className="text-white/50 text-sm mb-4">Section {idx + 1}</h4>
                        
                        <div className="flex flex-col gap-4">
                            <textarea 
                                required
                                rows={6}
                                value={section.content}
                                onChange={(e) => handleSectionContentChange(idx, e.target.value)}
                                className="bg-black/20 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-400 w-full"
                                placeholder="Write HTML or plain text here..."
                            />
                            
                            <div>
                                <label className="block text-sm text-white/70 mb-2">Replace Media (Images/Video)</label>
                                {section.file && section.file.length > 0 && (
                                    <div className="mb-2 text-xs text-white/50">Currently has {section.file.length} files attached. Uploading new files will replace them.</div>
                                )}
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*,video/*"
                                    onChange={(e) => handleSectionFilesChange(idx, e)}
                                    className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-2">Documentation Gallery</h3>
                {existingDocs.length > 0 && (
                    <div className="mb-4 text-xs text-white/50">Currently has {existingDocs.length} images. Uploading new images will replace them.</div>
                )}
                
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) setDocFiles(Array.from(e.target.files))
                    }}
                    className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
            </div>

            <div className="pt-6 border-t border-white/10 text-right flex gap-4 justify-end">
                <Link 
                    href="/dashboard/admin"
                    className="flex-1 max-w-[150px] bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-4 rounded-xl text-center transition-all"
                >
                    Cancel
                </Link>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] max-w-[300px] bg-amber-500 hover:bg-amber-400 text-white font-bold py-4 px-10 text-lg rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </form>
    )
}
