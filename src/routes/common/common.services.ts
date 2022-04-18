import mongoose from 'mongoose'
import debug from 'debug'

const log: debug.IDebugger = debug('app:mongoose-service')

class MongooseService {
    private count = 0
    retrySeconds = 5

    constructor() {
        setTimeout(this.connectWithRetry, this.retrySeconds * 1000)
    }

    public getMongoose() {
        return mongoose
    }

    connectWithRetry = () => {
        log('Attemptin to connect to Mongo DB')
        mongoose
            .connect(process.env.MOONGO_CONNECTION_STRING)
            .then(() => {
                log('MongoDB is connected')
            })
            .catch((err) => {
                log(
                    `MongoDB connection failed, will retry ${++this
                        .count} after ${this.retrySeconds} seconds`,
                    err
                )
                setTimeout(this.connectWithRetry, this.retrySeconds * 1000)
            })
    }
}

export default new MongooseService()
