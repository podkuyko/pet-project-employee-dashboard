import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { Response, Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { LoginDto, RegistrationDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  private readonly cookieMaxAge = 30 * 24 * 60 * 60 * 1000;
  private readonly settingsCookie = {
    httpOnly: true,
    maxAge: this.cookieMaxAge,
  };

  async registration(dto: RegistrationDto, response: Response) {
    const oldUser = await this.userService.findUserByEmail(dto.email);
    if (oldUser) throw new BadRequestException('user already registered!');

    const newUser = await this.userService.createUser(dto);
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(newUser);

    response.cookie('refresh_token', refresh_token, this.settingsCookie);

    const userOmitPassword = omit(newUser, 'password');
    return { ...userOmitPassword, access_token };
  }

  async login(dto: LoginDto, response: Response) {
    const validateUser = await this.userService.validateUser(
      dto.email,
      dto.password,
    );
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(validateUser);

    response.cookie('refresh_token', refresh_token, this.settingsCookie);

    const userOmitPassword = omit(validateUser, 'password');
    return { ...userOmitPassword, access_token };
  }

  async whoAmI(request: Request) {
    const authorizationHeaders = request.header('authorization');
    if (!authorizationHeaders)
      throw new UnauthorizedException('you are not authorized!');

    const payload = this.tokenService.decode(authorizationHeaders);
    const { password, ...userOmitPassword } =
      await this.userService.findUserByEmail(payload['email']);
    return userOmitPassword;
  }

  async refresh(request: Request, response: Response) {
    const authorizationHeader = request.header('authorization');
    if (!authorizationHeader)
      throw new UnauthorizedException('you are not authorized!');

    const payload = this.tokenService.decode(authorizationHeader);
    const user = await this.userService.findUserByEmail(payload['email']);
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(user);

    response.cookie('refresh_token', refresh_token, this.settingsCookie);

    return { access_token };
  }

  async logout(request: Request, response: Response) {
    const authorizationHeaders = request.header('authorization');
    if (authorizationHeaders) {
      await this.tokenService.deleteToken(authorizationHeaders);
    }
    response.clearCookie('refresh_token');
    return 'you logout';
  }
}
