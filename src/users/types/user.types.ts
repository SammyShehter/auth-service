import { bundle, subscription } from "../../common/common.types"

export type info = {
    user: user
    userBundle: bundle
    freeTrailBundle: null | bundle
    subscriptions: subscription[]
}

export type user = {
    _id: string
    defaultBundle: string
    freeTrailBundle: string
    packageName: string
    freeTrailExpirationDate: number
}
