import {Request, Response} from 'express'
import { handleError, handleSuccess } from '../../common/common.functions'
import debug from 'debug'
import UsersService from '../services/user.service'
import { User } from '../types/user.type'

const log: debug.IDebugger = debug('app:user-controller')

class UserController {
    public getAllUsers = async (
        req: Request,
        res: Response
    ) => {
        try {
            const users = await UsersService.getAllUsers()
            return handleSuccess(users, req, res)
        } catch (e) {
            return handleError(e, req, res)
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const credentials = req.body
            const token = await UsersService.login(credentials)
            return handleSuccess({token}, req, res)
        } catch (e) {
            return handleError(e, req, res)
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
            return handleSuccess(response, req, res, 201)
        } catch (e) {
            return handleError(e, req, res)
        }
    }

    public validateUser = async (
        req: Request,
        res: Response
    ) => {
        try {
            const userToken: string = req.body.token
            const user: User = await UsersService.validateUser(userToken)
            return handleSuccess(user, req, res)
        } catch (e) {
            handleError(e, req, res)
        }
    }
}

export default new UserController()
