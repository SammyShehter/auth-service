import fs from "fs"
import {Request, Response} from "express"
import { ErrorCodes } from "./error-codes.util"
import { ErrorCode } from "../types/common.type"

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
    error: ErrorCode | Error = ErrorCodes.GENERAL_ERROR,
    res: Response,
    status: number = 400
    ): Response => {
    let isSystemError = false

    if (error instanceof Error) {
        isSystemError = true
        const stack = error.stack.split("\n")
        const callerName = stack[1].trim().split(" ")[1]
        const genericMessage = error.message
        error = ErrorCodes.GENERAL_ERROR
        error.innerMessage = genericMessage
        error.caller_name = callerName
        error.alert = 5
    }

    if (error.alert >= 3 && process.env.NODE_ENV == "prod") {
        TelegramAPI.errorAlert(res.operationID, errorCode)
    }
    
    const errorLog: string[] | string = isSystemError
        ? error.stack.split(" at ")
        : error.innerMessage
    const message = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        REQUEST ${status === 400 ? "ERROR" : "WARNING"}!     
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Request ID: ${req.operationID}
Error Time: ${date()}
${
    isSystemError
        ? "Error in: " + errorLog[1] + "\n" + errorLog[0]
        : "Error: " + errorLog
}
    `
    fs.appendFile("error.log", message, () => {})
    return res.status(status).json({
        status: "FAILURE",
        errors: isSystemError
            ? [{message: ErrorCodes.GENERAL_ERROR.message}]
            : [{message: error.message, action: error.action}],
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
