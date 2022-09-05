import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import AuthenticationTokenManager from "../security/AuthenticationTokenManager";

interface RefreshAuthenticationUseCaseInterface {
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
}

class RefreshAuthenticationUseCase {
  private _authenticationRepository
  private _authenticationTokenManager
  
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: RefreshAuthenticationUseCaseInterface) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload: any) {
    this._verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    
    console.log('haiii')
    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken);
    console.log('haiii')

    return this._authenticationTokenManager.createAccessToken({ username, id });
  }

  _verifyPayload(payload: any) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default RefreshAuthenticationUseCase;
