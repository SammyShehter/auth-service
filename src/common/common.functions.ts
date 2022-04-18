import {Request, Response} from 'express'

const date = (): string => {
    return new Date().toLocaleString('he-IL')
}

export function handleSuccess(data: any, req: Request,
    res: Response,
    status: number = 200): Response {
    console.log('Successful request');
    return res.status(status).json({ message: 'SUCCESS', data })
}


export const handleError = (
    error: any,
    req: Request,
    res: Response,
    status: number = 400
): Response => {
    const errorLog: string[] | string = error.stack
        ? error.stack.split(' at ')
        : 'Unknow Error'

    console.log(`
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            REQUEST ${status === 400 ? 'ERROR' : 'WARNING'}!     
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    Error Time: ${date()}

    Error in:${errorLog[1]}
    ${errorLog[0]} 
    
    `)
    return res.status(status).json({ message: 'FAILURE' ,errors: [{ msg: error.message }] })
}

export const handle404 = (
    _: Request,
    res: Response
): Response => {
    console.log(`
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              404 REQUEST
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    Request Time: ${date()}
    
    `)
    return res.status(404).json({ message: 'FAILURE' ,errors: [{ msg: "404 not found" }] })
}

