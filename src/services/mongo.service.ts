import mongoose, {Schema, SchemaTypes} from "mongoose"
import EventEmitter from "events"
import {Role} from "../types/role.type"
import {ParsedUsers, User} from "../types/user.type"
import {CreateUserDto} from "../types/create.user.dto"

class MongooseService {
    constructor() {
        console.log("MongooseService instance created")
    }

    private roleSchema = new Schema<Role>(
        {
            value: {
                type: String,
                require: true,
                unique: true,
                default: "USER",
            },
        },
        {versionKey: false}
    )

    private userSchema = new Schema<User>(
        {
            username: {type: String, required: true, unique: true},
            password: {type: String, required: true},
            email: {type: String, unique: true},
            portals: {type: [String], required: true},
            role: {type: SchemaTypes.ObjectId, ref: "roles"},
        },
        {timestamps: true, versionKey: false}
    )

    private roleStorage = mongoose.model<Role>("roles", this.roleSchema)
    private userStorage = mongoose.model<User>("users", this.userSchema)

    connectWithRetry = (
        eventEmmiter: EventEmitter,
        count: number = 0,
        retryAttempt: number = 5,
        retrySeconds: number = 5
    ) => {
        if (count >= retryAttempt) {
            console.log("Connection to Mongo DB failed")
            process.exit(1)
        }
        console.log("Attemptin to connect to Mongo DB")
        mongoose
            .connect(process.env.MONGO_CONNECTION_STRING, {
                dbName: "auth",
            })
            .then(() => {
                console.log("MongoDB is connected")
                eventEmmiter.emit("ready")
            })
            .catch(async (err) => {
                count++
                console.log(
                    `MongoDB connection failed, will retry ${count}/${retryAttempt} attempt after ${retrySeconds} seconds`,
                    err.message
                )
                setTimeout(
                    () => this.connectWithRetry(eventEmmiter, count),
                    retrySeconds * 1000
                )
            })
    }

    findRole = async (value: string): Promise<Role> => {
        const res = await this.roleStorage.findOne({value}, {value: 0}).exec()
        return res
    }

    findRoleById = async (_id: string): Promise<Role> => {
        return this.roleStorage.findOne({_id}, {_id: 0}).exec()
    }

    getAllUsers = async (): Promise<ParsedUsers> => {
        return this.userStorage.find({}, {_id: 0, password: 0}).populate({path: "role", select: "value -_id"}).lean()
    }

    addUser = async (userFields: CreateUserDto): Promise<User> => {
        const instance = new this.userStorage({
            ...userFields,
        })
        await instance.save()
        return instance
    }

    findUser = async (username: string): Promise<User> => {
        return this.userStorage.findOne({username}).exec()
    }

    findUserById = async (id: string): Promise<User> => {
        const user: any = await this.userStorage
            .findOne(
                {_id: id},
                {_id: 0, password: 0, createdAt: 0, updatedAt: 0}
            )
            .populate({path: "role", select: "value -_id"})
            .lean()
            .exec()

        user.role = user.role.value

        return user
    }

    removeUser = async (username: string): Promise<boolean> => {
        await this.userStorage.deleteOne({username}).exec()
        return true
    }
}

export default new MongooseService()
