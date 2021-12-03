export type User = {
    _id?: string
    username: string
    roles: Array<string>
    email: string
    password?: string
    portals: Array<string>
}

export type DecodedUser = {
    id: string
    iat: number
    exp: number
}

export type ParsedUsers = Array<User>

export type Credentials = {
    username: string
    password: string
}

export type RegCredentials = {
    username: string
    email: string
    password: string
    portal: string
}