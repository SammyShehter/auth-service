import jwt from 'jsonwebtoken'
import debug from 'debug'
import { user, parsedUsers } from '../types/user.types'
import { UserModel } from '../models/user.model'

const log: debug.IDebugger = debug('app:user-service')

class UsersService {
    generateAccessToken = (id: string, roles:string[]): string => {
        const payload = {
            id,
            roles
        }

        return jwt.sign(payload, process.env.JWT_TOKEN, {expiresIn: '24h'})
    }

    getAllUsers = async (): Promise<parsedUsers> => {
        const users = await UserModel.find().lean()
        return users.map((user: user) => {
            delete user.password
            delete user._id

            return user
        })
    }
}

export default new UsersService()
