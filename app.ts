import * as http from "http"
import express from "express"
import cors from "cors"
import {CommonRoutesConfig} from "./src/routes/common.route"
import {UsersRoutes} from "./src/routes/user.route"
import {handle404} from "./src/utils/common.utils"
import {authEvents} from "./src/utils/events.util"
import CommonMiddleware from "./src/middlewares/common.middleware"
import {init} from "./src/utils/init.util"

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port: string = process.env.PORT
const routes: Array<CommonRoutesConfig> = []

app.use(cors())
app.use(express.json())
app.use(CommonMiddleware.handleInvalidJson)

init()

// ignite
authEvents.once("go", () => {
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
    console.log(`> Ready on port ${port}`)
}
