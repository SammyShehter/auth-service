import jwt from 'jsonwebtoken'
import debug from 'debug'
import bcrypt from 'bcrypt'
import {
    User,
    ParsedUsers,
    Credentials,
    RegCredentials,
} from '../types/user.type'
import UsersDao from '../daos/user.dao'
import RoleDao from '../daos/role.dao'

const log: debug.IDebugger = debug('app:user-service')

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

        return this.jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: '24h' })
    }

    private parseJwt = (jwtToken: string) => this.jwt.decode(jwtToken)

    public getAllUsers = async (): Promise<ParsedUsers> => {
        return UsersDao.getAllUsers()
    }

    public login = async (credentials: Credentials) => {
        const { username, password } = credentials
        const user = await UsersDao.findUser(username)
        if (!user) {
            throw new Error(
                `One or more fields are incorrect, please review your request`
            )
        }
        const validatePassword = this.cryptoService.compareSync(
            password,
            user.password
        )
        if (!validatePassword) {
            throw new Error(
                `One or more fields are incorrect, please review your request`
            )
        }
        const token = this.generateAccessToken(user._id, user.role as string)

        return token
    }

    public registration = async (regCredentials: RegCredentials) => {
        const { username, email, portal, password } = regCredentials
        const hash = bcrypt.hashSync(password, this.saltRounds)
        const {_id} = await RoleDao.findRole('USER')
        const newUser: User = await UsersDao.addUser({
            username,
            email,
            password: hash,
            portals: [portal],
            role: _id,
        })
        const token = this.generateAccessToken(newUser._id, newUser.role as string)
        return { username, token }
    }

    public validateUser = async (userId: string) => {
        return UsersDao.findUserById(userId)
    }

    public validateInnerCall = async (userToken: string) => {
        const {id} = this.parseJwt(userToken)
        return UsersDao.findUserById(id)
    }
}

export default new UsersService()
