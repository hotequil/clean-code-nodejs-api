import jwt from "jsonwebtoken";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import { Decrypter } from "@/data/protocols/criptography/decrypter";

export class JwtAdapter implements Encrypter, Decrypter {
    constructor (private readonly secret: string) {}

    async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve(jwt.sign({ id: value }, this.secret)));
    }

    async decrypt(token: string): Promise<string | null> {
        return await new Promise(resolve => resolve(jwt.verify(token, this.secret) as (string | null)));
    }
}
