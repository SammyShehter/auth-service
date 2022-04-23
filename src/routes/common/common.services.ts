import mongoose from "mongoose"
import debug from "debug"
import { authEvents } from "../../utils/events"

const log: debug.IDebugger = debug("app:mongoose-service")

class MongooseService {
    private count: number = 0
    private retryAttempt: number = 5
    private retrySeconds: number = 5

    constructor() {
        setTimeout(this.connectWithRetry, this.retrySeconds * 200)
    }

    public getMongoose() {
        return mongoose
    }

    connectWithRetry = () => {
        log("Attemptin to connect to Mongo DB")
        mongoose
            .connect(process.env.MOONGO_CONNECTION_STRING)
            .then(() => {
                authEvents.emit("ready")
                log("MongoDB is connected")
            })
            .catch(err => {
                if (this.count > 5) {
                    process.exit(-1)
                }
                this.count++
                log(
                    `MongoDB connection failed, will retry ${this.count}/${this.retryAttempt} attempt after ${this.retrySeconds} seconds`,
                    err
                )
                setTimeout(this.connectWithRetry, this.retrySeconds * 1000)
            })
    }
}

export default new MongooseService()
