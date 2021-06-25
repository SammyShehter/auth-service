import express from 'express'
import { error } from './common.functions'
import debug from 'debug'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { decodedUser } from './common.types'

const log: debug.IDebugger = debug('app:common-middleware')

class CommonMiddleware {
    validatorErrors = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors)
            } else {
                next()
            }
        } catch (e) {
            error(e, req, res)
        }
    }

    authUser = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if(!token){
                throw new Error(`No token provided`)
            }
            const decodedData: decodedUser = jwt.verify(token, process.env.JWT_TOKEN)
            req.user = decodedData
            next()
        } catch (e) {
            error(e, req, res, 401)
        }
    }

    authRole = (allowedRoles: string[]) => {
        return async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                const roles: string[] = req.user.roles
                
                let hasPermission: boolean = false
                allowedRoles.forEach(role => {
                    if(roles.includes(role)){
                        hasPermission = true
                    }
                })
                if(!hasPermission){
                    throw new Error(`You're not allowed to recieve this content`)
                } else {
                    next()
                }
            } catch (e) {
                error(e, req, res, 401)
            }
        }
    }

    trimStrings = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Trim all strings coming
            for (let prop in req.body) {
                if (typeof req.body[prop] === 'string') {
                    req.body[prop].trim()
                }
            }

            next()
        } catch (e) {
            error(e, req, res)
        }
    }
}

export default new CommonMiddleware()
