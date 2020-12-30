import { createHash } from "crypto";

export class Crypto implements CryptoTool {
    computeHash(login: string, password: string) {
        return createHash('sha256').update(Buffer.from(`${login}:${password}`, 'utf8').toString('base64')).digest('base64');
    }
}