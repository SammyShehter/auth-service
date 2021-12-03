import mongoose from 'mongoose'
import debug from 'debug'

const log: debug.IDebugger = debug('app:mongoose-service')

class MongooseService {
    private count = 0

    // private mongooseOptions = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useFindAndModify: false,
    // }

    constructor() {
        this.connectWithRetry()
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
                const retrySeconds = 5
                log(
                    `MongoDB connection failed, will retry ${++this
                        .count} after ${retrySeconds} seconds`,
                    err
                )
                setTimeout(this.connectWithRetry, retrySeconds * 1000)
            })
    }
}

export default new MongooseService()
