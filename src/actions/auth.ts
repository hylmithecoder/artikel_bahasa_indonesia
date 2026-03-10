"use server"

import { getAccountByUsername } from "@/services/get"
import { cookies } from "next/headers"
import { compare, hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username")?.toString()
    const password = formData.get("password")?.toString()

    if (!username || !password) {
        return { error: "Username and password are required." }
    }

    try {
        const account = await getAccountByUsername(username)
        console.log(account)
        const isMatched = await compare(password, account.password)
        console.log(isMatched)
        if (!account || !isMatched) {
            return { error: "Invalid username or password" }
        }

        // Setting cookie session
        // For simplicity, we'll store a JSON with username and basic admin check
        const sessionData = {
            username: account.username,
            isAdmin: account.isAdmin === "admin"
        }
        
        const cookieStore = await cookies()
        cookieStore.set("session_cookie", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        })
        
    } catch(err) {
        console.error("Login error", err)
        return { error: "An unexpected error occurred." }
    }

    const { isAdmin } = JSON.parse((await cookies()).get("session_cookie")?.value || "{}");
    redirect(isAdmin ? "/dashboard/admin" : "/dashboard")
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("session_cookie")
    redirect("/login")
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session_cookie")
    if (!session?.value) return null
    try {
        return JSON.parse(session.value) as { username: string, isAdmin: boolean }
    } catch {
        return null
    }
}

export async function addAccountAction(prevState: any, formData: FormData) {
    try {
        const session = await getSession()
        console.log(session)
        if (!session?.isAdmin) throw new Error("Unauthorized")
        
        const username = formData.get("username")?.toString()
        const password = formData.get("password")?.toString()
        
        if (!username || !password) return { error: "Required fields missing" }
        
        // Ensure no duplicate using our get function if needed, but here simple catch is enough
        const { createAccount } = await import("@/services/mutate")
        const hashedPassword = await hash(password, 12)
        await createAccount(username, hashedPassword)
        
    } catch (err: any) {
        return { error: err.message || "Failed to add account" }
    }
    
    // We cannot use revalidatePath if importing it fails inside action, 
    // better to return success and reload on client.
    return { success: true }
}

export async function deleteAccountAction(id: number) {
    const session = await getSession()
    if (!session?.isAdmin) throw new Error("Unauthorized")
    
    const { deleteAccount } = await import("@/services/mutate")
    await deleteAccount(id)
}
