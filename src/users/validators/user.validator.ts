import { check, validationResult } from 'express-validator'
import debug from 'debug'
import CommonValidator from '../../common/common.validator'

const log: debug.IDebugger = debug('app:users-validator')

class UsersValidator extends CommonValidator {
    registrationChecks = this.validate([
        check('username')
            .notEmpty()
            .trim()
            .escape()
            .withMessage(`Username can't be empty`),
        check('email').notEmpty().isEmail().normalizeEmail(),
        check('portal').notEmpty().trim().escape(),
        check('password')
            .notEmpty()
            .trim()
            .escape()
            .withMessage('Password cannot be empty')
            .isLength({ min: 5 })
            .withMessage('Must be at least 5 chars long'),
    ])

    loginChecks = this.validate([
        check('username')
            .notEmpty()
            .trim()
            .escape()
            .withMessage(`Username can't be empty`),
        check('password')
            .notEmpty()
            .trim()
            .escape()
            .withMessage('Password cannot be empty'),
    ])

    innerRequestCheck = this.validate([
        check('token')
            .notEmpty()
            .trim()
            .escape()
            .withMessage(`Token can't be empty`),
    ])
}

export default new UsersValidator()
