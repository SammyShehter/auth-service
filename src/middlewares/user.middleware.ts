import express from 'express'
import { handleError } from '../utils/common.utils'
import MongoService from '../services/mongo.service'

export class UsersMiddleware {
    public ecoSystemUser = (allowedPortal: string[]) => async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const portalUser = req.body.portal
            
            if(portalUser && allowedPortal.includes(portalUser)){
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
            const candidate = await MongoService.findUser(username)
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
