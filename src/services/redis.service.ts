import {createClient} from "redis"

class Redis {
    private globalClient = createClient({url: process.env.REDIS_IP, password: "cookies"})

    constructor() {
        console.log("> Redis initiated...")
    }

    connectWithRetry = async (
        count: number = 0,
        retryAttempt: number = 5,
        retrySeconds: number = 5
    ): Promise<boolean> => {
        if (count >= retryAttempt) {
            console.log("Connection to Redis failed")
            return false
        }
        try {
            await this.globalClient.connect()
            console.log("> Redis connection... ok")
            this.globalClient.on("error", (err) => {
                console.log(`Redis threw ${err.message}`)
            })
            return this.globalClient.isReady
        } catch (err: any) {
            await this.globalClient.disconnect()
            count++
            console.log(
                `Redis connection failed, will retry ${count}/${retryAttempt} attempt after ${retrySeconds} seconds`,
                err.message
            )
            await new Promise((resolve) =>
                setTimeout(resolve, retrySeconds * 1000)
            )
            return this.connectWithRetry(count, retryAttempt, retrySeconds)
        }
    }

    get client() {
        return this.globalClient
    }

    get = (key: string) => {
        return this.globalClient.get(key)
    }

    set = (key: string, value: any, ttl = 0) => {
        return this.globalClient.set(
            key,
            JSON.stringify(value),
            ttl > 0 ? {EX: ttl} : {}
        )
    }
}

export default new Redis()
