import express from "express"
import {handleError} from "../utils/common.utils"
import MongoService from "../services/mongo.service"
import {ErrorCodes} from "../utils/error-codes.util"

export class UsersMiddleware {
    public ecoSystemUser =
        (allowedPortal: string[]) =>
        async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                const portalUser = req.body.portal
                if (portalUser && allowedPortal.includes(portalUser)) {
                    return next()
                } else {
                    throw ErrorCodes.PORTAL_NOT_SUPPORTED
                }
            } catch (e) {
                return handleError(e, res, 400)
            }
        }

    public checkUserDoesntExists = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const {username, email} = req.body
            const [foundByEmail, foundByUseranme] = await Promise.all([
                MongoService.findUserByEmail(email),
                MongoService.findUserByUsername(username),
            ])
            if (foundByEmail || foundByUseranme) {
                throw ErrorCodes.ALREADY_EXISTING_USER(
                    foundByEmail ? `email: ${email}` : `username: ${username}`
                )
            }
            next()
        } catch (e) {
            return handleError(e, res, 401)
        }
    }
}

export default new UsersMiddleware()
