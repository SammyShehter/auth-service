import * as dotenv from 'dotenv'
import * as expressWinston from 'express-winston'
import * as http from 'http'
import * as winston from 'winston'
import express from 'express'
import cors from 'cors'
import debug from 'debug'
import { CommonRoutesConfig } from './src/common/common.routes.config'
import { UsersRoutes } from './src/users/users.routes.config'

dotenv.config()

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port: string = process.env.PORT
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
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
        return false
    },
}

const errorLoggerOptions: expressWinston.ErrorLoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
        winston.format.json()
    ),
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions))
app.use(expressWinston.errorLogger(errorLoggerOptions))

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

// Creating instace of Routes
routes.push(new UsersRoutes(app))

// Start server
server.listen(port, () => {
    console.log(`Server started at port ${port}`)
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`)
    })
})
