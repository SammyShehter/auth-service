import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import CommonMiddleware from '../common/common.middleware'
import UsersController from './controllers/user.controller'
import UsersMiddleware from './middleware/user.middleware'
import { check } from 'express-validator'

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes')
    }

    public static allowedPortal = ['mafia']

    configureRoutes() {
        this.app
            .route('/')
            .all(
                CommonMiddleware.auth, // main auth controller(apikey or userToken check)
                CommonMiddleware.authRole(['ADMIN', 'SERVER'])
            )
            .get(UsersController.getAllUsers)

        this.app
            .route('/login')
            .all(
                // CommonMiddleware.trimStrings,
                check('username').notEmpty().trim().escape(),
                check('password').notEmpty().trim().escape(),
                CommonMiddleware.validatorErrors
            )
            .post(UsersController.login)

        this.app
            .route('/registration')
            .all(
                check('username').notEmpty().trim().escape(),
                check('email').isEmail().normalizeEmail(),
                check('portal').notEmpty().trim().escape(),
                check('password')
                    .notEmpty()
                    .trim()
                    .escape()
                    .isLength({ min: 4, max: 10 }),
                CommonMiddleware.validatorErrors,
                UsersMiddleware.ecoSystemUser(UsersRoutes.allowedPortal),
                UsersMiddleware.checkNewUserExists
            )
            .post(UsersController.registration)

        this.app
            .route('/loadUser')
            .all(
                CommonMiddleware.auth
            )
            .get(UsersController.loadUser)
        return this.app
    }
}
