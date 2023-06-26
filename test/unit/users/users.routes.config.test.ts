import { expect } from "chai";
import express from 'express'
import { UsersRoutes } from '../../../src/routes/user.route'

describe("UsersRoutes", () => {
    const app: express.Application = express()
    const UsersRoutesIns = new UsersRoutes(app)
    describe("#configureRoutes()", () => {
        context("valid call", () => {
            let result: express.Application

            before(() => {
                result = UsersRoutesIns.configureRoutes()
            });

            it("should return express app", () => {
                expect(result).to.be.equal(app);
            });
        });
    })
})