export interface CreateUserDto {
    username: string
    email: string
    password: string
    portals: Array<string>
    roles: Array<string>
}
