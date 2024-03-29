import bcrypt from "bcrypt";
import { type Hasher } from "@/data/protocols/criptography/hasher";
import { type HashComparer } from "@/data/protocols/criptography/hash-comparer";

export class BcryptAdapter implements Hasher, HashComparer {
    constructor (private readonly SALT: number) {}

    async hash (value: string): Promise<string> {
        return await bcrypt.hash(value, this.SALT);
    }

    async compare (value: string, hash: string): Promise<boolean> {
         return await bcrypt.compare(value, hash);
    }
}
