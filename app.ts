import * as http from "http"
import express from "express"
import cors from "cors"
import debug from "debug"
import {CommonRoutesConfig} from "./src/routes/common.route"
import {UsersRoutes} from "./src/routes/user.route"
import {handle404} from "./src/utils/common.functions"
import {authEvents} from "./src/utils/events.util"
import CommonMiddleware from "./src/middlewares/common.middleware"
import { init } from "./src/utils/init.util"

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port: string = process.env.PORT
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug("app")

app.use(cors())
app.use(express.json())
app.use(CommonMiddleware.handleInvalidJson)

init()

authEvents.once("ready", () => {
    routes.push(new UsersRoutes(app))
    
    app.use(handle404)

    server.listen(port, startServer)
})
function startServer() {
    console.log(`
 █████╗ ██╗   ██╗████████╗██╗  ██╗      ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗
██╔══██╗██║   ██║╚══██╔══╝██║  ██║      ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝
███████║██║   ██║   ██║   ███████║█████╗███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  
██╔══██║██║   ██║   ██║   ██╔══██║╚════╝╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  
██║  ██║╚██████╔╝   ██║   ██║  ██║      ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗
╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝      ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝
   `)
    console.log(`Server is listening on port ${port}`)
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`)
    })
}
