import { expect } from "chai";
import express from 'express'
import { UsersRoutes } from '../../../src/users/users.routes.config'

describe("UsersRoutes", () => {
    const app: express.Application = express()
    const UsersRoutesIns = new UsersRoutes(app)
    describe("#configureRoutes()", () => {
        context("valid call", () => {
            let result = null

            before(() => {
                result = UsersRoutesIns.configureRoutes()
            });

            it("should return express app", () => {
                expect(result).to.be.equal(app);
            });
        });
    })
})