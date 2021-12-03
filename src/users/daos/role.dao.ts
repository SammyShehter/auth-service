import debug from 'debug'
import MongooseService from '../../common/common.services'
import { Model } from 'mongoose'
import { Role } from '../types/role.type'

const log: debug.IDebugger = debug('app:roless-dao')

class RolesDao {
    private roleStorage: Model<Role>

    constructor() {
        const Schema = MongooseService.getMongoose().Schema
        const RoleSchema = new Schema<Role>(
            {
                value: {
                    type: String,
                    require: true,
                    unique: true,
                    default: 'USER',
                },
            },
            { versionKey: false }
        )

        this.roleStorage = MongooseService.getMongoose().model<Role>(
            'Roles',
            RoleSchema
        )
        log('Created new instance of RolesDao')
    }

    async findRole(value: string) {
        return this.roleStorage.findOne({ value }).exec()
    }
}

export default new RolesDao()
