import {userErrorMessage} from "../types/error.type"
import {jsonValidationError} from "../types/http.type"

export class ErrorCodes {
    static get GENERAL_ERROR(): userErrorMessage {
        return {
            message: "GENERAL ERROR",
            action: "action message",
            innerMessage: "inner message",
        }
    }
    
    static get TOKEN_ABSENT(): userErrorMessage {
        return {
            message: "TOKEN ABSENT",
            action: "Please provide a valid user token",
            innerMessage: "no token provided",
        }
    }

    static get INVALID_CREDENTIALS(): userErrorMessage {
        return {
            message: "INVALID CREDENTIALS",
            action: "Please use a valid username and password",
            innerMessage: "credentials are incorrect",
        }
    }

    static get INVALID_TOKEN(): userErrorMessage {
        return {
            message: "INVALID TOKEN",
            action: "Please use a valid user token",
            innerMessage: "token is incorrect",
        }
    }

    static get NO_timestamp(): userErrorMessage {
        return {
            message: "NO timestamp",
            action: "Please provide a valid timestamp",
            innerMessage:
                "no timestamp sent",
        }
    }

    static get CANT_START_NEW_SHIFT(): userErrorMessage {
        return {
            message: "CAN'T START NEW SHIFT",
            action: "Please end your current shift before starting a new one",
            innerMessage: "User tried start new shift before ending previous"
        }
    }
        static get CANT_END_SHIFT(): userErrorMessage {
        return {
            message: "CAN'T END SHIFT",
            action: "Please start your shift before ending",
            innerMessage: "User tried end shift before starting"
        }
    }


    static JSON_VALIDATION_FAILED({
        action,
        // param,
    }: jsonValidationError): userErrorMessage {
        return {
            message: "JSON VALIDATION FAILED",
            action,
            innerMessage: `User sent wrong param`,
        }
    }
}
