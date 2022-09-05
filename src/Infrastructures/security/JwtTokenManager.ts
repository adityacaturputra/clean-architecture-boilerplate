import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager';
import InvariantError from '../../Commons/exceptions/InvariantError';
import Jwt from 'jsonwebtoken';

class JwtTokenManager extends AuthenticationTokenManager {
  private _jwt
  constructor(jwt: typeof Jwt | any) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload: any) {
    return this._jwt.sign(payload, (process.env.ACCESS_TOKEN_KEY || 'secret'), { expiresIn: process.env.ACCCESS_TOKEN_AGE });
  }

  async createRefreshToken(payload: any) {
    return this._jwt.sign(payload, (process.env.REFRESH_TOKEN_KEY || 'secret'));
  }

  async verifyRefreshToken(token: string) {
    try {
      this._jwt.verify(token, (process.env.REFRESH_TOKEN_KEY || 'secret'));
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string): Promise<any> {
    return this._jwt.decode(token);
  }
}

export default JwtTokenManager;
