import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import CommonMiddleware from '../common/common.middleware'
import UsersController from './controllers/user.controller'
import UsersMiddleware from './middleware/user.middleware'
import { check } from 'express-validator'
import userMiddleware from './middleware/user.middleware'

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes')
    }

    configureRoutes() {
        this.app
            .route('/users')
            .all(
                CommonMiddleware.authUser,
                CommonMiddleware.authRole(['ADMIN']),
            )
            .get(UsersController.getAllUsers)

        this.app
            .route('/users/login')
            .all(
                CommonMiddleware.trimStrings,
                check('username', `Username can't be empty`).notEmpty(),
                check('password', `Password can't be empty`).notEmpty(),
                CommonMiddleware.validatorErrors,
            )
            .post(UsersController.login)

        this.app
            .route('/users/registration')
            .all(
                CommonMiddleware.trimStrings,
                check('username', `Username can't be empty`).notEmpty(),
                check(
                    'password',
                    'Password has to contain more than 4and less than 10 symbols'
                ).isLength({ min: 4, max: 10 }),
                CommonMiddleware.validatorErrors,
                UsersMiddleware.checkNewUserExists
            )
            .post(UsersController.registration)
        return this.app
    }
}
