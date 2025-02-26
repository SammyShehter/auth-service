import fs from "fs"
import {Response} from "express"
import {ErrorCodes} from "./error-codes.util"
import {ErrorCode} from "../types/common.type"
import TelegramAPI from "../services/telegram.service"
import {createHash} from "crypto"

const date = (): string => {
    return new Date().toLocaleString("he-IL")
}

export const handleSuccess = (
    data: any,
    res: Response,
    status: number = 200
): Response => {
    return res.status(status).json({status: "SUCCESS", data})
}

export const handleError = (
    error: ErrorCode = ErrorCodes.GENERAL_ERROR, // Can also recieve NodeJS Runtime error
    res: Response,
    status: number = error?.status || 400
): Response => {
    if (error instanceof Error) {
        const stack = error.stack.split("\n")
        const callerName = stack[1].trim().split(" ")[1]
        const genericMessage = error.message
        error = ErrorCodes.GENERAL_ERROR
        error.innerMessage = genericMessage
        error.caller_name = callerName
        error.alert = true
    }

    if (error.alert) {
        TelegramAPI.errorAlert(res.operationID, error)
    }

    const message = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        REQUEST ${status === 400 ? "ERROR" : "WARNING"}!     
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Request ID: ${res.operationID}
Error Time: ${date()}
Error Message ${error.innerMessage}
    `
    fs.appendFile("error.log", message, () => {})
    return res.status(status).json({
        status: "FAILURE",
        errors: {message: error.message, action: error.action},
    })
}

export const handle404 = (req: any, res: Response): Response => {
    const message = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            404 REQUEST
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Request Time: ${date()}
Requested Path: ${req.originalUrl}
        `
    fs.appendFile("404.log", message, () => {})
    return res
        .status(404)
        .json({status: "FAILURE", errors: [{message: "404 not found"}]})
}

export function hashString(input: string) {
    return createHash("sha256").update(input).digest("hex")
}
