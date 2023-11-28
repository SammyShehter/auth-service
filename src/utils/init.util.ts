import MongoService from "../services/mongo.service"
import RedisService from "../services/redis.service"
import { authEvents } from "./events.util"

export async function init() {
    if (process.env.INIT !== "fine") {
        console.log("env file is not confiured")
        process.exit(1)
    }

    const checklist = await Promise.all([
        MongoService.connectWithRetry(),
        RedisService.connectWithRetry(),
    ])

    if (checklist.every(pass => pass)) {
        console.log("> Everything is ok!")
        authEvents.emit("go")
    } else {
        console.log("checks failed", checklist)
        process.exit(1)
    }
}
