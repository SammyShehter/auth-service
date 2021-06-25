import { Schema, model } from 'mongoose'

const RoleSchema: Schema = new Schema(
    {
        value: {type: String, require:true, unique: true, default: "USER"}
    },
    { versionKey: false }
)

export const RoleModel = model('Role', RoleSchema)
