import * as bcrypt from 'bcrypt';
import { LoginRequestType, RegisterRequestType } from './auth.schema';
import { UserRepository } from '../user/user.repository';
import { InvalidLoginError } from '@api/errors/errors';

export class AuthService {
  constructor(userRP?: UserRepository) {
    this.userRepository = userRP ?? new UserRepository();
  }

  private userRepository: UserRepository;

  async registerRequest(data: RegisterRequestType) {
    const { password } = data.user;
    const hashed = await this.hashPassword(password);
    data.user.password = hashed;

    const result = await this.userRepository.createUserAndCompany(
      data.user,
      data.company,
    );

    return { result };
  }

  async loginRequest(data: LoginRequestType) {
    const userAndCompany = await this.userRepository.findByEmail(data.email);

    if (!userAndCompany?.user) {
      throw new InvalidLoginError();
    }

    if (!userAndCompany?.company) {
      throw new Error("User doesn't have a company?");
    }
    const { user, company } = userAndCompany;
    const equal = await this.passwordsMatch(data.password, user.password);
    if (!equal) {
      throw new InvalidLoginError();
    }
    user.password = '';
    return { user, company };
  }
  async passwordsMatch(password: string, hash: string) {
    const equal = await bcrypt.compare(password, hash);
    return equal;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 1);
  }
}
