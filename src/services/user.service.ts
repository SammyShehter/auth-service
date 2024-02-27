import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {
    User,
    ParsedUsers,
    Credentials,
    RegCredentials,
} from "../types/user.type"
import MongoService from "./mongo.service"
import {ErrorCodes} from "../utils/error-codes.util"

class UsersService {
    private cryptoService: any
    private saltRounds: number
    private jwt: any

    constructor() {
        this.cryptoService = bcrypt
        this.saltRounds = 15
        this.jwt = jwt
    }

    private generateAccessToken = (id: string, role: string): string => {
        const payload = {
            id,
            role,
        }

        return this.jwt.sign(payload, process.env.JWT_TOKEN, {expiresIn: "20m"})
    }

    private parseJwt = (jwtToken: string) => this.jwt.decode(jwtToken)

    public getAllUsers = async (): Promise<ParsedUsers> => {
        return MongoService.getAllUsers()
    }

    public login = async (credentials: Credentials) => {
        const {username, password} = credentials
        const user = await MongoService.findUserByUsername(username)
        if (!user) {
            throw ErrorCodes.USER_NOT_FOUND
        }
        const validPassword = this.cryptoService.compareSync(
            password,
            user.password
        )
        if (!validPassword) {
            throw ErrorCodes.INVALID_CREDENTIALS
        }
        const token = this.generateAccessToken(user._id, user.role['value'])

        return {token, user}
    }

    public registration = async (regCredentials: RegCredentials) => {
        const {username, email, portal, password, password_confirm} =
            regCredentials
        if (password !== password_confirm)
            throw ErrorCodes.PASSWORD_CONFIRMATION_ERROR
        const hash = bcrypt.hashSync(password, this.saltRounds)
        const role = await MongoService.findRole("USER")
        if(!role || !role._id) {
            throw ErrorCodes.ROLE_NOT_FOUND
        }
        const newUser: User = await MongoService.addUser({
            username,
            email,
            password: hash,
            portals: [portal],
            role: role._id,
        })
        const token = this.generateAccessToken(
            newUser._id,
            newUser.role['value']
        )
        return {username, token}
    }

    public validateUser = async (userId: string) => {
        return MongoService.findUserById(userId)
    }

    public validateInnerCall = async (userToken: string) => {
        const {id} = this.parseJwt(userToken)
        return MongoService.findUserById(id)
    }
}

export default new UsersService()
