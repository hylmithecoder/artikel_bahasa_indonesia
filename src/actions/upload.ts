"use server"

import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

export async function uploadFile(file: File): Promise<string> {
    if (!file || file.size === 0) {
        throw new Error("No file provided")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name)
    // Generate unique filename to avoid collisions
    const uniqueFilename = `${crypto.randomBytes(16).toString("hex")}${ext}`
    
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const filePath = path.join(uploadDir, uniqueFilename)

    // Write file to public/uploads
    await fs.writeFile(filePath, buffer)
    
    // Return the relative URL (path from public root)
    return `/uploads/${uniqueFilename}`
}
