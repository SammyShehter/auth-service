import express from 'express'
import { error } from '../../common/common.functions'
import { UserModel } from '../models/user.model'
import { RoleModel } from '../models/role.model'
import debug from 'debug'
import UsersService from '../services/user.service'
import { user } from '../types/user.types'
const bcrypt = require('bcrypt')
const saltRounds = 10

const log: debug.IDebugger = debug('app:user-controller')

class UserController {
    public getAllUsers = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            return res.status(200).json({message: 'ok'})
        } catch (e) {
            return error(e, req, res)
        }
    }

    public login = async (req: express.Request, res: express.Response) => {
        try {
            const { username, password } = req.body
            const user = await UserModel.findOne({username})
            if(!user){
                throw new Error(`One or more fields are incorrect, please review your request`)
            }
            const validatePassword = bcrypt.compareSync(password, user.password)
            if(!validatePassword){
                throw new Error(`One or more fields are incorrect, please review your request`)
            }
            const token = UsersService.generateAccessToken(user._id, user.roles)
            res.status(200).json({message: 'Success!', token})
        } catch (e) {
            return error(e, req, res)
        }
    }

    public registration = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            const { username, password } = req.body
            const hash = bcrypt.hashSync(password, saltRounds)
            const userRole = await RoleModel.findOne({ value: 'USER' })
            const newUser = new UserModel({
                username,
                password: hash,
                roles: [userRole.value],
            })
            await newUser.save()
            return res.status(200).json({message:`${username} user was created!`})
        } catch (e) {
            return error(e, req, res)
        }
    }
}

export default new UserController()
