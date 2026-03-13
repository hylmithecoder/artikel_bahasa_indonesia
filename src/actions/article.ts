"use server"

import { createContent, updateContent, deleteContent } from "@/services/mutate"
import { getSession } from "@/actions/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAuth() {
    const session = await getSession()
    if (!session) {
        throw new Error("Unauthorized")
    }
    return session
}

async function requireAdmin() {
    const session = await getSession()
    if (!session?.isAdmin) {
        throw new Error("Unauthorized")
    }
    return session
}

export async function addArticleAction(prevState: any, formData: FormData) {
    try {
        const session = await requireAuth()
        
        const title = formData.get("title")?.toString()
        const content = formData.get("content")?.toString()
        const documentation = formData.get("documentation")?.toString()
        const created_by = session.username
        
        if (!title || !content || !documentation) {
            return { error: "All fields are required" }
        }

        await createContent(title, content, documentation, created_by)
        
    } catch (err) {
        console.error(err)
        return { error: "Failed to create article" }
    }
    
    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard")
    redirect("/dashboard/admin")
}

export async function editArticleAction(prevState: any, formData: FormData) {
    try {
        await requireAdmin()
        
        const id = Number(formData.get("id"))
        const title = formData.get("title")?.toString()
        const content = formData.get("content")?.toString()
        const documentation = formData.get("documentation")?.toString()
        const created_by = formData.get("user")?.toString()
        
        if (!id || !title || !content || !documentation || !created_by) {
            return { error: "All fields are required" }
        }

        await updateContent(id, title, content, documentation, created_by)
        
    } catch (err) {
        console.error(err)
        return { error: "Failed to update article" }
    }
    
    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard")
    redirect("/dashboard/admin")
}

export async function deleteArticleAction(id: number) {
    try {
        await requireAdmin()
        await deleteContent(id)
        
        revalidatePath("/dashboard/admin")
        revalidatePath("/dashboard")
    } catch (err) {
        console.error(err)
        throw new Error("Failed to delete article")
    }
    
    redirect("/dashboard/admin")
}
