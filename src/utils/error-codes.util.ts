import {ErrorCode} from "../types/common.type"
import {jsonValidationError} from "../types/http.type"

export class ErrorCodes {
    static get GENERAL_ERROR(): ErrorCode {
        return {
            message: "GENERAL ERROR",
            action: "action message",
            innerMessage: "inner message",
            alert: 1,
        }
    }

    static get TOKEN_ABSENT(): ErrorCode {
        return {
            message: "TOKEN ABSENT",
            action: "Please provide a valid user token",
            innerMessage: "no token provided",
            alert: 1,
        }
    }

    static get INVALID_CREDENTIALS(): ErrorCode {
        return {
            message: "INVALID CREDENTIALS",
            action: "Please use a valid username and password",
            innerMessage: "credentials are incorrect",
            alert: 1,
        }
    }

    static get INVALID_TOKEN(): ErrorCode {
        return {
            message: "INVALID TOKEN",
            action: "Please use a valid user token",
            innerMessage: "token is incorrect",
            alert: 1,
        }
    }

    static get PORTAL_NOT_SUPPORTED(): ErrorCode {
        return {
            message: "PORTAL NOT SUPPORTED",
            action: "Please provide a valid portal",
            innerMessage: "Unsopported portal",
            alert: 1,
        }
    }

    static get EMAIL_ALREADY_IN_USE(): ErrorCode {
        return {
            message: "EMAIL ALREADY IN USE",
            action: "Please use another email",
            innerMessage: "New candidate used already registered email",
            alert: 1,
        }
    }

    static get USER_NOT_FOUND(): ErrorCode {
        return {
            message: "USER NOT FOUND",
            action: "Please use a valid account",
            innerMessage: "Login attempt with wrong creds",
            alert: 3,
        }
    }

    static get PASSWORD_CONFIRMATION_ERROR(): ErrorCode {
        return {
            message: "PASSWORD CONFIRMATION ERROR",
            action: "Password confirmation wont match to the password you've sent, please try again",
            innerMessage: "Password confirmation error",
            alert: 1,
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
            alert: 1,
        }
    }

    static ACCESS_DENIED(path: string, here: string): ErrorCode {
        return {
            message: "ACCESS DENIED",
            action: "You're not allowed to see the data",
            innerMessage: `User requested ${path} and failed in ${here}`,
            alert: 3,
        }
    }
}
