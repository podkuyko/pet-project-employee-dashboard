import { TokenService } from 'src/token/token.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Global,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';

@Global()
@Injectable()
export class DefaultAuthorizedGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private userService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const userToken = this.extractBearerTokenFromHeader(req);
    try {
      const isVerifyToken = await this.tokenService.verify(userToken);

      if (userToken && isVerifyToken) {
        const { password, ...userDataOmitPassword } =
          await this.userService.getUserById(isVerifyToken.id);
        req.user = userDataOmitPassword;
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractBearerTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
