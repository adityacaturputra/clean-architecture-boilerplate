import RegisterUser from '../../Domains/users/entities/RegisterUser';
import UserRepository from '../../Domains/users/UserRepository';
import PasswordHash from '../security/PasswordHash';

interface AddUserUseCaseInterface {
  userRepository: UserRepository;
  passwordHash: PasswordHash;
}

class AddUserUseCase {
  _userRepository: UserRepository;
  _passwordHash: PasswordHash;
  
  constructor({ userRepository, passwordHash }: AddUserUseCaseInterface) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload: any) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

export default AddUserUseCase;
