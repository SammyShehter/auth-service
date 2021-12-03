import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import CommonMiddleware from '../common/common.middleware'
import UsersController from './controllers/user.controller'
import UsersMiddleware from './middleware/user.middleware'
import { check } from 'express-validator'
import UserValidator from './validators/user.validator'

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes')
    }

    public static allowedPortal = ['mafia', 'blogue']

    configureRoutes() {
        this.app
            .route('/')
            .all(
                CommonMiddleware.auth,
                CommonMiddleware.authRole(['ADMIN', 'SERVER'])
            )
            .get(UsersController.getAllUsers)

        this.app
            .route('/login')
            .all(UserValidator.loginChecks)
            .post(UsersController.login)

        this.app
            .route('/registration')
            .all(
                UserValidator.registrationChecks,
                UsersMiddleware.ecoSystemUser(UsersRoutes.allowedPortal),
                UsersMiddleware.checkUserExists
            )
            .post(UsersController.registration)

        // this.app
        //     .route('/loadUser')
        //     .all(CommonMiddleware.auth)
        //     .get(UsersController.loadUser)
        
        return this.app
    }
}
