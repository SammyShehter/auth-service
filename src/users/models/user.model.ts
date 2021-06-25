import { Schema, model } from 'mongoose'

const UserSchema: Schema = new Schema(
    {
        username: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        email: { type: String, unique: true },
        portals: [{ type: String, required: true }],
        roles: [{ type: String, ref: 'Role' }],
    },
    { timestamps: true, versionKey: false }
)

export const UserModel = model('User', UserSchema)
