import fs from "fs"
import {Request, Response, NextFunction} from "express"
import {handleError} from "../utils/common.utils"
import {validationResult} from "express-validator"
import jwt from "jsonwebtoken"
import {Role} from "../types/role.type"
import MongoServices from "../services/mongo.service"
import {randomUUID} from "crypto"
import {ErrorCodes} from "../utils/error-codes.util"

class CommonMiddleware {
    validatorErrors = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors)
            } else {
                next()
            }
        } catch (e) {
            handleError(e, req, res)
        }
    }

    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.headers.authorization)
                return this.authUserToken(req, res, next)

            if (req.headers.apikey) return this.apiKeyAuth(req, res, next)

            throw ErrorCodes.ACCESS_DENIED(
                req.originalUrl,
                "CommonMiddleware.auth"
            )
        } catch (e) {
            handleError(e, req, res, 401)
        }
    }

    public apiKeyAuth = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const apikey = req.headers.inner_call
            if (apikey === process.env.APIKEY) {
                req.user = {
                    role: "SERVER",
                }
                next()
            } else {
                throw ErrorCodes.ACCESS_DENIED(
                    req.originalUrl,
                    "CommonMiddleware.apiKeyAuth"
                )
            }
        } catch (e) {
            handleError(e, req, res, 401)
        }
    }

    private authUserToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const token = req.headers.authorization?.split(" ")[1]
            if (!token) {
                throw ErrorCodes.TOKEN_ABSENT
            }
            const decodedData = jwt.verify(token, process.env.JWT_TOKEN)
            req.user = decodedData
            next()
        } catch (e) {
            handleError(e, req, res, 401)
        }
    }

    authRole = (allowedRoles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userRole: Role = {
                    value: null,
                }
                const {value} = await MongoServices.findRoleById(req.user.role)
                userRole.value = value

                let hasPermission = allowedRoles.includes(userRole.value)
                if (hasPermission) return next()
                throw ErrorCodes.ACCESS_DENIED(
                    req.originalUrl,
                    "CommonMiddleware.authRole"
                )
            } catch (e) {
                handleError(e, req, res, 401)
            }
        }
    }

    senderCheck = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the request adress
            // Match it to the allowed list of senders,
            // save to req.sender name of service
            next()
        } catch (e) {
            handleError(e, req, res)
        }
    }

    trimStrings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Trim all strings coming
            for (let prop in req.body) {
                if (typeof req.body[prop] === "string") {
                    req.body[prop].trim()
                }
            }

            next()
        } catch (e) {
            handleError(e, req, res)
        }
    }

    handleInvalidJson = (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (err instanceof SyntaxError && "body" in err) {
            res.status(400).json({error: "Invalid JSON body"})
        } else {
            next(err)
        }
    }

    saveRequest = async (
        req: Request,
        _: Response,
        next: NextFunction
    ): Promise<void> => {
        req.operationID = randomUUID()
        const message = `
Request ID: ${req.operationID}
Method: ${req.method} 
Requested URL: ${req.originalUrl} 
${
    Object.keys(req.body).length !== 0
        ? "Request Body: " + JSON.stringify(req.body) + "\n"
        : ""
}`
        console.log(message)

        fs.appendFile("app.log", message, () => {})
        next()
    }
}

export default new CommonMiddleware()
