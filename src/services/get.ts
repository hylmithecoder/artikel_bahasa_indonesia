import { pool } from "@/services/basesql"
import { AccountModel, ContentModel } from "@/app/globalvariable"

export const getAccounts = async () => {
    const [rows] = await pool.query<AccountModel[] & import("mysql2").RowDataPacket[]>("SELECT * FROM account ORDER BY created_at DESC")
    return rows
}

export const getAccountByUsername = async (username: string) => {
    const [rows] = await pool.query<AccountModel[] & import("mysql2").RowDataPacket[]>(
        "SELECT * FROM account WHERE username = ?",
        [username]
    )
    return rows[0]
}

export const getContents = async () => {
    const [rows] = await pool.query<ContentModel[] & import("mysql2").RowDataPacket[]>(
        "SELECT * FROM tbl_content ORDER BY created_at DESC"
    )
    return rows
}

export const getContentById = async (id: number) => {
    const [rows] = await pool.query<ContentModel[] & import("mysql2").RowDataPacket[]>(
        "SELECT * FROM tbl_content WHERE id = ?",
        [id]
    )
    return rows[0]
}

export const getContentsByAuthor = async (username: string) => {
    const [rows] = await pool.query<ContentModel[] & import("mysql2").RowDataPacket[]>(
        "SELECT * FROM tbl_content WHERE created_by = ? ORDER BY created_at DESC",
        [username]
    )
    return rows
}