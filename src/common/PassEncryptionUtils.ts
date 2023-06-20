import {
  scrypt as scryptCallback,
  timingSafeEqual,
  randomBytes,
} from 'node:crypto';
import { promisify } from 'util';
const scrypt: (...args) => Promise<Buffer> = promisify(scryptCallback);

export class PassEncryptionUtils {
  static async encryptPassword(plaintext: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = await scrypt(plaintext, salt, 32);
    const hashHex = hash.toString('hex');
    const ciphertext = `${hashHex}:${salt}`;
    return ciphertext;
  }

  static async verifyPassword(
    candidate: string,
    password: string,
  ): Promise<boolean> {
    const [ciphertext, salt] = password.split(':');
    const hash = await scrypt(candidate, salt, 32);
    const ciphertextBuffer = Buffer.from(ciphertext, 'hex');
    return timingSafeEqual(ciphertextBuffer, hash);
  }
}
