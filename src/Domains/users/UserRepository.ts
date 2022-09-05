import RegisteredUser from "./entities/RegisteredUser";
import RegisterUser from "./entities/RegisterUser";

interface UserRepositoryInterface {
  addUser(user: RegisterUser): Promise<RegisteredUser>
  verifyAvailableUsername(username: string): Promise<void>
  getPasswordByUsername(username: string): Promise<string>
}

class UserRepository implements UserRepositoryInterface{
  async addUser(registerUser: RegisterUser | Object): Promise<RegisteredUser> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(username: string): Promise<void> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getPasswordByUsername(username: string): Promise<string> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getIdByUsername(username: string): Promise<string> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default UserRepository;
