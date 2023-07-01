import express from 'express'
import { handleError } from '../utils/common.utils'
import MongoService from '../services/mongo.service'
import { ErrorCodes } from '../utils/error-codes.util'

export class UsersMiddleware {
    public ecoSystemUser = (allowedPortal: string[]) => async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const portalUser = req.body.portal
            if(portalUser && allowedPortal.includes(portalUser)){
                return next()
            } else {
                throw ErrorCodes.PORTAL_NOT_SUPPORTED
            }
        } catch (e) {
            handleError(e, req, res, 400)
        }
    }

    public checkUserDoesntExists = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const {username} = req.body
            const candidate = await MongoService.findUser(username)
            if(candidate){
                throw ErrorCodes.EMAIL_ALREADY_IN_USE
            }
            next()
        } catch (e) {
            return handleError(e, req, res, 401)
        }
    }
}

export default new UsersMiddleware()
