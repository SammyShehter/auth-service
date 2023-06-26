import {validationResult} from "express-validator"
import {Request, Response, NextFunction} from "express"
import {ErrorCodes} from "../utils/error-codes.util"
import { handleError } from "../utils/common.functions"

export default class CommonValidator {
    customValidationResult = validationResult.withDefaults({
        formatter: ({msg}) => {
            return ErrorCodes.JSON_VALIDATION_FAILED({
                action: msg,
            })
        },
    })

    validate = (validations: any) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            for (const validation of validations) {
                const result = await validation.run(req)
                if (result.errors.length) break
            }

            const errors = this.customValidationResult(req)
            return errors.isEmpty()
                ? next()
                : handleError(errors.array()[0], req, res)
        }
    }
}
