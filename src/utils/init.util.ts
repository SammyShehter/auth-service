import MongoService from "../services/mongo.service"
import { authEvents } from "./events.util"

export async function init() {
    if (process.env.INIT !== "fine") {
        console.log("env file is not confiured")
        process.exit(1)
    }

    // check data base connection
    MongoService.connectWithRetry(authEvents)
}
