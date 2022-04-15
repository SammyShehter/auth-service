import debug from 'debug'
import express from 'express'
import { handleError } from '../../common/common.functions'
import UsersDao from '../daos/user.dao'

const log: debug.IDebugger = debug('app:user-middleware')

export class UsersMiddleware {
    private readonly stringFields: string[] = []

    // public checkFields = (
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) => {
    //     try {
    //         const reqLength: number = Object.getOwnPropertyNames(
    //             req.body
    //         ).length
    //         if (reqLength !== this.stringFields.length) {
    //             throw new Error(
    //                 `Request body is illegal. Request has ${
    //                     reqLength > this.stringFields.length ? 'more' : 'less'
    //                 } fields, than intended. Please reconsider your request`
    //             )
    //         }
    //         this.validatePatch(req, res, next)
    //     } catch (e) {
    //         handleError(e, req, res)
    //     }
    // }

    public validatePatch = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            for (let prop in req.body) {
                let fieldExists = this.stringFields.includes(prop)
                if (!fieldExists) {
                    throw new Error(
                        `${prop} is not taken into account by the program, please reconsider your request`
                    )
                }
            }
            next()
        } catch (e) {
            handleError(e, req, res)
        }
    }

    public ecoSystemUser = (allowedPortal: string[]) => async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const portalUser = req.body.portal
            if(portalUser &&  allowedPortal.includes(portalUser)){
                next()
            } else {
                throw new Error('This type of portal is not supported')
            }
        } catch (e) {
            handleError(e, req, res, 400)
        }
    }

    public checkUserNotExists = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const {username} = req.body
            const candidate = await UsersDao.findUser(username)
            if(candidate){
                throw new Error('User already exists!')
            }
            next()
        } catch (e) {
            return handleError(e, req, res, 401)
        }
    }
}

export default new UsersMiddleware()
