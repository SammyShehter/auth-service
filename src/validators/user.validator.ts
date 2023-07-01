import {body, check} from "express-validator"
import CommonValidator from "./common.validator"

class UsersValidator extends CommonValidator {
    registrationChecks = this.validate([
        body("username")
            .exists()
            .withMessage(`Please provide a username`)
            .notEmpty()
            .withMessage(`Please provide a username`)
            .trim()
            .escape()
            .isString()
            .withMessage(`Please send the username as a string`)
            .isLength({max: 15})
            .withMessage(`Please limit username to 15 characters`),
        body("email")
            .exists()
            .withMessage(`Please provide an email`)
            .notEmpty()
            .withMessage(`Please provide an email`)
            .trim()
            .escape()
            .isString()
            .withMessage(`Please send the email as a string`)
            .isEmail()
            .withMessage(`Provided data doesn't contain an email`)
            .normalizeEmail(),
        body("portal")
            .optional()
            .exists()
            .withMessage(`Please provide a potral`)
            .notEmpty()
            .withMessage(`Please provide a portal`)
            .trim()
            .escape()
            .isString()
            .withMessage(`Please send the portal as a string`),
        body("password")
            .exists()
            .withMessage(`Please provide password`)
            .notEmpty()
            .withMessage(`Please provide password`)
            .trim()
            .escape()
            .isString()
            .withMessage(`Please send the password as a string`)
            .isLength({max: 15})
            .withMessage(`Please limit password to 15 characters`),
    ])

    loginChecks = this.validate([
        body("username")
            .exists()
            .withMessage(`Please provide username`)
            .notEmpty()
            .withMessage(`Please provide username`)
            .trim()
            .escape()
            .isString()
            .withMessage(`Please send the password as a string`)
            .isLength({max: 15})
            .withMessage(`Please limit username to 15 characters`),
        body("password")
            .exists()
            .withMessage(`Please provide password`)
            .notEmpty()
            .withMessage(`Please provide password`)
            .trim()
            .escape()
            .isString()
            .withMessage(`Please send the password as a string`)
            .isLength({max: 15})
            .withMessage(`Please limit password to 15 characters`),
    ])

    innerRequestCheck = this.validate([
        check("token")
            .exists()
            .notEmpty()
            .trim()
            .escape()
            .withMessage(`Token can't be empty`),
    ])
}

export default new UsersValidator()
