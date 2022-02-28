import bcrypt from "bcrypt";

import { Encrypter } from "../../data/protocols/criptography/encrypter";

export class BcryptAdapter implements Encrypter {
     constructor (private readonly SALT: number) {}

    async encrypt (value: string): Promise<string> {
        return await bcrypt.hash(value, this.SALT);
    }
}
