import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import CommonMiddleware from '../common/common.middleware'
import UsersController from './controllers/user.controller'
import UsersMiddleware from './middleware/user.middleware'
import UserValidator from './validators/user.validator'

export class UsersRoutes extends CommonRoutesConfig {
    private allowedPortal: Array<string>

    constructor(app: express.Application) {
        super(app, 'UsersRoutes')
        this.allowedPortal = ['mafia', 'blogue']
    }

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
                UsersMiddleware.ecoSystemUser(this.allowedPortal),
                UsersMiddleware.checkUserNotExists
            )
            .post(UsersController.registration)
        this.app
            .route('/validation')
            .all(
                CommonMiddleware.senderCheck,
                CommonMiddleware.apiKeyAuth,
                CommonMiddleware.authRole(['SERVER']),
                UserValidator.innerRequestCheck
            )
            .post(UsersController.validateUser)
        
        return this.app
    }
}
