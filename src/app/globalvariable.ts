export interface AccountModel {
    id: number
    created_at: Date
    username: string
    password: string
}

export interface ContentSection {
    content: string
    file: string[]
}

export interface ContentModel {
    id: number
    created_at: Date
    title: string
    content: string | ContentSection[] // Can be raw JSON string from DB or parsed array
    documentation: string | string[] // Can be raw JSON string or parsed array
}