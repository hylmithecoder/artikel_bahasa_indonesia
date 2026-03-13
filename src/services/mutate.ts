import { pool } from "@/services/basesql"
import { ResultSetHeader } from "mysql2"
import { getAccountByUsername } from "./get"

export const createContent = async (title: string, content: string, documentation: string, created_by: string) => {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO tbl_content (title, content, documentation, created_by) VALUES (?, ?, ?, ?)",
        [title, content, documentation, created_by]
    )
    return result
}

export const updateContent = async (id: number, title: string, content: string, documentation: string, created_by: string) => {
    const currentTimeStamp = new Date()
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE tbl_content SET title = ?, content = ?, documentation = ?, updated_at = ?, created_by = ? WHERE id = ?",
        [title, content, documentation, currentTimeStamp, created_by, id]
    )
    return result
}

export const deleteContent = async (id: number) => {
    const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM tbl_content WHERE id = ?",
        [id]
    )
    return result
}

export const createAccount = async (username: string, password: string) => {
    const hasAccount = await getAccountByUsername(username)
    if (hasAccount) throw new Error("Account already exists")
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO account (username, password) VALUES (?, ?)",
        [username, password]
    )
    return result
}

export const deleteAccount = async (id: number) => {
    const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM account WHERE id = ?",
        [id]
    )
    return result
}
