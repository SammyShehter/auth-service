import express from 'express'

const date = (): string => {
    return new Date().toLocaleString('he-IL')
}

export const error = (
    error: Error,
    req: express.Request,
    res: express.Response,
    status: number = 400
): express.Response => {
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
    return res.status(status).json({ errors: [{ msg: error.message }] })
}
