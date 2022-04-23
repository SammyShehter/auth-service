import {Request, Response} from 'express'
import {ErrorCodes} from '../../utils/error-codes'

const date = (): string => {
    return new Date().toLocaleString('he-IL')
}

export function handleSuccess(data: any, req: Request,
    res: Response,
    status: number = 200): Response {
    return res.status(status).json({ message: 'SUCCESS', data })
}


export const handleError = (
    error: any,
    _: Request,
    res: Response,
    status: number = 400
): Response => {
    const errorLog: string[] | string = error.stack
        ? error.stack.split(' at ')
        : 'Unknow Error'

    console.log(`\n
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            REQUEST ${status === 400 ? 'ERROR' : 'WARNING'}!     
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    Error Time: ${date()}

    Error in:${errorLog[1]}
    ${errorLog[0]} 
    
    `)
    return res.status(status).json({ message: 'FAILURE' ,errors: [{ msg: ErrorCodes.GENERAL_ERROR }] })
}

export const handle404 = (
    _: Request,
    res: Response
): Response => {
    console.log(`\n
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              404 REQUEST
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    Request Time: ${date()}
    
    `)
    return res.status(404).json({ message: 'FAILURE' ,errors: [{ msg: "404 not found" }] })
}

