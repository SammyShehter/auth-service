import { Schema, model } from 'mongoose'


const UserSchema: Schema = new Schema(
    {
        username: {type:String, require:true, unique:true},
        password: {type: String, require: true},
        roles: [{type: String, ref: 'Role'}]
        
    },
    { versionKey: false }
)

export const UserModel = model('User', UserSchema)
