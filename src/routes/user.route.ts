import express from "express"
import {CommonRoutesConfig} from "./common.route"
import CommonMiddleware from "../middlewares/common.middleware"
import UsersController from "../controllers/user.controller"
import UsersMiddleware from "../middlewares/user.middleware"
import UserValidator from "../validators/user.validator"

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "UsersRoutes")
    }

    configureRoutes() {
        this.app
            .route("/all")
            .all(
                CommonMiddleware.saveRequest,
                CommonMiddleware.auth,
                CommonMiddleware.authRole(["ADMIN", "SERVER"])
            )
            .get(UsersController.getAllUsers)

        this.app
            .route("/login")
            .all(CommonMiddleware.saveRequest, UserValidator.loginChecks)
            .post(UsersController.login)

        this.app
            .route("/registration")
            .all(
                CommonMiddleware.saveRequest,
                UserValidator.registrationChecks,
                UsersMiddleware.ecoSystemUser(["polemica", "blogue", "tests"]), // TODO: Array should move to .env
                UsersMiddleware.checkUserDoesntExists
            )
            .post(UsersController.registration)
        this.app
            .route("/validation")
            .all(
                CommonMiddleware.saveRequest,
                CommonMiddleware.auth,
                CommonMiddleware.authRole(["ADMIN", "USER"])
            )
            .post(UsersController.validateUser)

        this.app
            .route("/innercall")
            .all(
                CommonMiddleware.saveRequest,
                CommonMiddleware.senderCheck,
                CommonMiddleware.apiKeyAuth,
                UserValidator.innerRequestCheck
            )
            .post(UsersController.validateInnerCall)

        return this.app
    }
}
