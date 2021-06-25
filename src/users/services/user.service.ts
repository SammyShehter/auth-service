import jwt from 'jsonwebtoken'
import debug from 'debug'

const log: debug.IDebugger = debug('app:user-service')

class UsersService {
    generateAccessToken = (id: string, roles:string[]) => {
        const payload = {
            id,
            roles
        }

        return jwt.sign(payload, process.env.JWT_TOKEN, {expiresIn: '24h'})
    }
}

export default new UsersService()
