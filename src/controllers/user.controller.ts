import {Request, Response} from 'express'
import UsersService from '../services/user.service'
import { User } from '../types/user.type'
import { handleError, handleSuccess } from '../utils/common.utils'

class UserController {
    public getAllUsers = async (
        req: Request,
        res: Response
    ) => {
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
            const token = await UsersService.login(credentials)
            return handleSuccess({token}, res)
        } catch (e) {
            return handleError(e, res)
        }
    }

    public registration = async (
        req: Request,
        res: Response
    ) => {
        try {
            const regCredentials = req.body
            const { username, token } = await UsersService.registration(regCredentials)
            const response = { message: `${username} user was created!`, token }
            return handleSuccess(response, res, 201)
        } catch (e) {
            return handleError(e, res)
        }
    }

    public validateUser = async (
        req: Request,
        res: Response
    ) => {
        try {
            const {id} = req.user
            const user: User = await UsersService.validateUser(id)
            return handleSuccess(user, res)
        } catch (e) {
            handleError(e, res)
        }
    }

    public validateInnerCall = async (
        req: Request,
        res: Response
    ) => {
        try {
            const userToken: string = req.body.token
            const user: User = await UsersService.validateInnerCall(userToken)
            return handleSuccess(user, res)
        } catch (e) {
            handleError(e, res)
        }
    }
}

export default new UserController()
