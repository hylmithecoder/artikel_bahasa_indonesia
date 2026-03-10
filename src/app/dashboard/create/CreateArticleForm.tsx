"use client"

import { useState } from "react"
import { uploadFile } from "@/actions/upload"
import { addArticleAction } from "@/actions/article"

export default function CreateArticleForm() {
    const [title, setTitle] = useState("")
    const [sections, setSections] = useState([{ content: "", files: [] as File[] }])
    const [docFiles, setDocFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleAddSection = () => {
        setSections([...sections, { content: "", files: [] }])
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
            const newSections = [...sections]
            newSections[index].files = Array.from(e.target.files)
            setSections(newSections)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            // Upload all files and build the JSON structure
            const uploadedSections = await Promise.all(
                sections.map(async (sec) => {
                    const uploadedFileUrls = await Promise.all(
                        sec.files.map(file => uploadFile(file))
                    )
                    return {
                        content: sec.content,
                        file: uploadedFileUrls
                    }
                })
            )

            const uploadedDocs = await Promise.all(
                docFiles.map(file => uploadFile(file))
            )

            // Submit values to Server Action
            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", JSON.stringify(uploadedSections))
            formData.append("documentation", JSON.stringify(uploadedDocs))

            const result = await addArticleAction(null, formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch (err: any) {
            setError(err.message || "Failed to submit article")
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
                
                {sections.map((section, idx) => (
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
                                <label className="block text-sm text-white/70 mb-2">Attach Media (Images/Video)</label>
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
                <p className="text-white/50 text-sm mb-4">Upload images to show at the bottom of the article.</p>
                
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

            <div className="pt-6 border-t border-white/10 text-right">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-10 text-lg rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Uploading & Publishing..." : "Publish Article"}
                </button>
            </div>
        </form>
    )
}
