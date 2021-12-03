import debug from 'debug'
import { CreateUserDto } from '../dto/create.user.dto'
import MongooseService from '../../common/common.services'
import { ParsedUsers, User } from '../types/user.type'
import { Model } from 'mongoose'

const log: debug.IDebugger = debug('app:users-dao')

class UsersDao {
    private userStorage: Model<User>

    constructor() {
        const Schema = MongooseService.getMongoose().Schema
        const ObjectId = MongooseService.getMongoose().Schema.Types.ObjectId
        const UserSchema = new Schema<User>(
            {
                username: { type: String, require: true, unique: true },
                password: { type: String, require: true },
                email: { type: String, unique: true },
                portals: [{ type: String, required: true }],
                roles: [{ type: ObjectId, ref: 'Role' }],
            },
            { timestamps: true, versionKey: false }
        )

        this.userStorage = MongooseService.getMongoose().model<User>(
            'Users',
            UserSchema
        )
        log('Created new instance of UsersDao')
    }

    getAllUsers = async (): Promise<ParsedUsers> => {
        return this.userStorage.find({}, { _id: 0, password: 0 }).lean()
    }

    async addUser(userFields: CreateUserDto): Promise<User> {
        const instance = new this.userStorage({
            ...userFields,
        })
        await instance.save()
        return instance
    }

    async findUser(username: string): Promise<User> {
        return this.userStorage.findOne({ username }).exec()
    }

    async removeUser(username: string): Promise<boolean> {
        await this.userStorage.deleteOne({ username }).exec()
        return true
    }
}

export default new UsersDao()
