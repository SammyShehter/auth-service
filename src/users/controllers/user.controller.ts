import express from 'express'
import { error } from '../../common/common.functions'
import debug from 'debug'
import UsersService from '../services/user.service'
import { User } from '../types/user.type'

const log: debug.IDebugger = debug('app:user-controller')

class UserController {
    public getAllUsers = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            const users = await UsersService.getAllUsers()
            return res.status(200).json(users)
        } catch (e) {
            return error(e, req, res)
        }
    }

    public login = async (req: express.Request, res: express.Response) => {
        try {
            const token = await UsersService.login(req.body)
            res.status(200).json({ message: 'Success!', token })
        } catch (e) {
            return error(e, req, res)
        }
    }

    public registration = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            const { username, token } = await UsersService.registration(
                req.body
            )
            return res
                .status(200)
                .json({ message: `${username} user was created!`, token })
        } catch (e) {
            return error(e, req, res)
        }
    }

    public validateUser = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            const user: User = await UsersService.validateUser(req.body.token)

            return res.status(200).json({user})
        } catch (e) {
            error(e, req, res)
        }
    }
}

export default new UserController()
