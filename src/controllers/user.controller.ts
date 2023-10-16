import {Request, Response} from "express"
import UsersService from "../services/user.service"
import {User} from "../types/user.type"
import {handleError, handleSuccess, hashString} from "../utils/common.utils"
import Redis from "../services/redis.service"

class UserController {
    public getAllUsers = async (_: Request, res: Response) => {
        try {
            const users = await UsersService.getAllUsers()
            return handleSuccess(users, res)
        } catch (e) {
            return handleError(e, res)
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const credentials = req.body
            const {token, user} = await UsersService.login(credentials)
            Redis.set(`user:${hashString(token)}`, user, 60)
            return handleSuccess({token}, res)
        } catch (e) {
            return handleError(e, res)
        }
    }

    public registration = async (req: Request, res: Response) => {
        try {
            const regCredentials = req.body
            const {username, token} = await UsersService.registration(
                regCredentials
            )
            const response = {message: `${username} user was created!`, token}
            return handleSuccess(response, res, 201)
        } catch (e) {
            return handleError(e, res)
        }
    }

    public validateUser = async (req: Request, res: Response) => {
        try {
            const {id} = req.user
            const user: User = await UsersService.validateUser(id)
            return handleSuccess(user, res)
        } catch (e) {
            handleError(e, res)
        }
    }

    public validateInnerCall = async (req: Request, res: Response) => {
        try {
            const userToken: string = req.body.token
            const user: User = await UsersService.validateInnerCall(userToken)
            Redis.set(`user:${hashString(userToken)}`, user, 60)
            return handleSuccess(user, res)
        } catch (e) {
            handleError(e, res)
        }
    }
}

export default new UserController()
