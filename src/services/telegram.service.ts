import axios from "axios"
import {ErrorCode} from "../types/common.type"

class TelegramAPI {
    constructor() {}

    errorAlert = (operationID: string, errorCode: ErrorCode) => {
        axios
            .post(`http://localhost:8887`, {
                service: `Auth service`,
                message: errorCode,
            })
            .catch((e) => console.log(e.message))
    }
}

export default new TelegramAPI()
