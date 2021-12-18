import debug from 'debug'
import MongooseService from '../../common/common.services'
import { Model } from 'mongoose'
import { Role } from '../types/role.type'

const log: debug.IDebugger = debug('app:roles-dao')

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

    async findRoleById(_id: string) {
        return this.roleStorage.findOne({ _id }, {_id: 0}).exec()
    }
}

export default new RolesDao()
