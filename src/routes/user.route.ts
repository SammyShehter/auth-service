import express from 'express'
import { CommonRoutesConfig } from './common.route'
import CommonMiddleware from '../middlewares/common.middleware'
import UsersController from '../controllers/user.controller'
import UsersMiddleware from '../middlewares/user.middleware'
import UserValidator from '../validators/user.validator'

export class UsersRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'UsersRoutes')
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
                UsersMiddleware.ecoSystemUser(['mafia', 'blogue']),
                UsersMiddleware.checkUserNotExists
            )
            .post(UsersController.registration)
        this.app
            .route('/validation')
            .all(
                CommonMiddleware.auth,
                CommonMiddleware.authRole(['ADMIN'])
            )
            .post(UsersController.validateUser)

        this.app
        .route('/innercall')
        .all(
            CommonMiddleware.senderCheck,
            CommonMiddleware.apiKeyAuth,
            CommonMiddleware.authRole(['SERVER']),
            UserValidator.innerRequestCheck
        )
        .post(UsersController.validateInnerCall)
        
        return this.app
    }
}
