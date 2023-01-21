import { Hasher } from "@/data/protocols/criptography/hasher";
import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import { HashComparer } from "@/data/protocols/criptography/hash-comparer";

export const mockHasher = (result: string): Hasher => {
    class HasherStub implements Hasher {
        async hash (value: string): Promise<string> {
            console.log(value);

            return await new Promise(resolve => resolve(result));
        }
    }

    return new HasherStub()
}

export const mockDecrypter = (result: string): Decrypter => {
    class DecrypterStub implements Decrypter{
        async decrypt(value: string): Promise<string | null> {
            console.log(value)

            return await new Promise(resolve => resolve(result));
        }
    }

    return new DecrypterStub()
}

export const mockEncrypter = (result: string): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            console.log(value);

            return await new Promise(resolve => resolve(result));
        }
    }

    return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare (value: string, hash: string): Promise<boolean> {
            console.log(value, hash);

            return await new Promise(resolve => resolve(true));
        }
    }

    return new HashComparerStub()
}
