import * as dotenv from 'dotenv'
import * as expressWinston from 'express-winston'
import * as http from 'http'
import * as winston from 'winston'
import mongoose from 'mongoose'
import express, { Router } from 'express'
import cors from 'cors'
import debug from 'debug'
import { CommonRoutesConfig } from './src/common/common.routes.config'
import { UsersRoutes } from './src/users/user.routes.config'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MOONGO_CONNECTION_STRING: string
            JWT_TOKEN:string,
            PORT: number
        }
    }
}

dotenv.config()
const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port: Number = process.env.PORT
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug('app')

app.use(express.json())
app.use(cors())

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
        return false
    }, // optional: allows to skip some log messages based on request and/or response
}

// here we are crashing on unhandled errors and spitting out a stack trace,
// but only when in debug mode
if (process.env.DEBUG) {
    process.on('unhandledRejection', function (reason) {
        debugLog('Unhandled Rejection:', reason)
        process.exit(1)
    })
} else {
    loggerOptions.meta = false // when not debugging, make terse
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions))

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.prettyPrint(),
            winston.format.colorize({ all: true }),
            winston.format.json()
        ),
    })
)

// here we are crashing on unhandled errors and spitting out a stack trace,
// but only when in debug mode
if (process.env.DEBUG) {
    process.on('unhandledRejection', function (reason) {
        debugLog('Unhandled Rejection:', reason)
        process.exit(1)
    })
} else {
    loggerOptions.meta = false // when not debugging, make terse
}

routes.push(new UsersRoutes(app))

//connection to DB
async function start() {
    try {
        await mongoose.connect(process.env.MOONGO_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
    } catch (e) {
        console.log(`Server error ${e}`)
        process.exit(1)
    }
}
start()

server.listen(port, () => {
    console.log(`Server started at port ${port}`)
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`)
    })
})
