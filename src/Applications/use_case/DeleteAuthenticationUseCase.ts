import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";

interface DeleteAuthenticationUseCaseInterface {
  authenticationRepository: AuthenticationRepository
}

class DeleteAuthenticationUseCase {
  _authenticationRepository: AuthenticationRepository
  
  constructor({
    authenticationRepository,
  }: DeleteAuthenticationUseCaseInterface) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload: any) {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _validatePayload(payload: any) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteAuthenticationUseCase;
