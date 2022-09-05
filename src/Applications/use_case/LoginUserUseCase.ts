import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import UserRepository from "../../Domains/users/UserRepository";
import AuthenticationTokenManager from "../security/AuthenticationTokenManager";
import PasswordHash from "../security/PasswordHash";

import UserLogin from '../../Domains/users/entities/UserLogin';
import NewAuthentication from '../../Domains/authentications/entities/NewAuth';

interface LoginUserUseCaseInterface {
  userRepository: UserRepository
  authenticationRepository: AuthenticationRepository
  authenticationTokenManager: AuthenticationTokenManager
  passwordHash: PasswordHash
}

class LoginUserUseCase {
  private _userRepository
  private _authenticationRepository
  private _authenticationTokenManager
  private _passwordHash
  
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: LoginUserUseCaseInterface) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload: any) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ username, id });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ username, id });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

export default LoginUserUseCase;
