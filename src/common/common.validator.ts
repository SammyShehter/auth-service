import { validationResult } from "express-validator"
import {Request, Response, NextFunction} from 'express' 

export default class CommonValidator {
    customValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            return {
                param: error.param,
                message: error.msg,
            }
        },
    })

    validate = (validations: any) => {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            for (let validation of validations) {
                const result = await validation.run(req)
                if (result.errors.length) break
            }

            const errors = this.customValidationResult(req)
            if (errors.isEmpty()) {
                return next()
            }
            res.status(400).json({ message: 'FAILURE', data: errors.array() })
        }
    }
}
