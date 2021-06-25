export type user = {
    _id?: string
    username: string
    roles: string[]
    password?: string
}

export type parsedUsers = user[]