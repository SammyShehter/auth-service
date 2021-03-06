import express = require('express');
import { decodedUser } from '../../src/common/common.types';
// import { IncomingHttpHeaders } from 'http';

declare global {
    namespace Express {
        interface Request {
            user: decodedUser,
            correlation_id: string
        }
    }
}


declare module 'http' {
    interface IncomingHttpHeaders {
        apikey?:string
        host: string
    }
}