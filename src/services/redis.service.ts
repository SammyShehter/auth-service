import {createClient} from "redis"

function redisError(err) {
    console.log(`Redis threw ${err.message}`)
}

class Redis {
    private globalClient = createClient({url: process.env.REDIS_IP})

    constructor() {
        this.globalClient.connect()
        this.globalClient.on("error", redisError)
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
