import PasswordHash from '../../Applications/security/PasswordHash';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError';
import bcryptType from 'bcrypt';

class BcryptPasswordHash extends PasswordHash {
  private _bcrypt
  private _saltRound
  constructor(bcrypt: typeof bcryptType, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password: string) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password: string, hashedPassword: string) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

export default BcryptPasswordHash;
