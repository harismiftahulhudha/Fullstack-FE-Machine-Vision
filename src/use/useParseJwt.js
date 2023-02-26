import { Buffer } from 'buffer'
export function useParseJwt(token) {
    if (token) {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } else {
        return null
    }
}