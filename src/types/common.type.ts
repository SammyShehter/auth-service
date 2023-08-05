export type ErrorCode = {
    [x: string]: any
    message: string
    action: string
    innerMessage: string
    alert: number
    inner_message?: string
    caller_name?: string
}
