import {ErrorCode} from "../types/common.type"
import {jsonValidationError} from "../types/http.type"
import { Credentials } from "../types/user.type"

export class ErrorCodes {
    static get GENERAL_ERROR(): ErrorCode {
        return {
            message: "GENERAL ERROR",
            action: "action message",
            innerMessage: "inner message",
            alert: true,
        }
    }

    static get TOKEN_ABSENT(): ErrorCode {
        return {
            message: "TOKEN ABSENT",
            action: "Please provide a valid user token",
            innerMessage: "no token provided",
            alert: true,
        }
    }

    static INVALID_CREDENTIALS({username, password}: Credentials): ErrorCode {
        return {
            message: "INVALID CREDENTIALS",
            action: "Please use a valid username and password",
            innerMessage: `Failed login attempt - username: ${username} | password: ${password}`,
            alert: true,
        }
    }

    static get INVALID_TOKEN(): ErrorCode {
        return {
            message: "INVALID TOKEN",
            action: "Please use a valid user token",
            innerMessage: "token is incorrect",
            alert: true,
        }
    }

    static get PORTAL_NOT_SUPPORTED(): ErrorCode {
        return {
            message: "PORTAL NOT SUPPORTED",
            action: "Please provide a valid portal",
            innerMessage: "Unsopported portal",
            alert: true,
        }
    }

    static ALREADY_EXISTING_USER(identificator: string): ErrorCode {
        return {
            message: "ALREADY EXISTING USER",
            action: "User already exists, please use unique credentials",
            innerMessage: `New candidate used ${identificator} which already exists`,
            alert: true,
        }
    }

    static INVALID_JSON_BODY(error: any): ErrorCode {
        return {
            message: "INVALID JSON BODY",
            action: "JSON sent was not valid. Please review your request",
            innerMessage: `Req.Body JSON was invalid. Sent ${JSON.stringify(error)}`,
            alert: true,
        }
    }

    static USER_NOT_FOUND({username, password}: Credentials): ErrorCode {
        return {
            message: "USER NOT FOUND",
            action: "Please use a valid account",
            innerMessage: `Login attempt with wrong creds: username: ${username} | password: ${password}`,
            alert: true,
        }
    }

    static get ROLE_NOT_FOUND(): ErrorCode {
        return {
            message: "ROLE NOT FOUND",
            action: "Please contact admin for role assignment",
            innerMessage: "Cold start demands roles table to have 'USER' role. Please add it ASAP",
            alert: true,
        }
    }

    static get PASSWORD_CONFIRMATION_ERROR(): ErrorCode {
        return {
            message: "PASSWORD CONFIRMATION ERROR",
            action: "Password confirmation wont match to the password you've sent, please try again",
            innerMessage: "Password confirmation error",
            alert: true,
        }
    }

    static JSON_VALIDATION_FAILED({
        action,
        param,
    }: jsonValidationError): ErrorCode {
        return {
            message: "JSON VALIDATION FAILED",
            action,
            innerMessage: `User sent wrong ${param}`,
            alert: true,
        }
    }

    static ACCESS_DENIED(path: string, here: string): ErrorCode {
        return {
            message: "ACCESS DENIED",
            action: "You're not allowed to see the data",
            innerMessage: `User requested ${path} and failed in ${here}`,
            alert: true,
        }
    }
}
