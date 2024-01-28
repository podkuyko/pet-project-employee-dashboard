import { TokenService } from 'src/token/token.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Global,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ROLE_KEY } from 'src/auth/decorators/roles.decorator';

@Global()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLE_KEY, ctx.getHandler());

    if (!roles) return true;

    const req = ctx.switchToHttp().getRequest();
    const userToken = this.extractBearerTokenFromHeader(req);
    try {
      const payloadToken = await this.tokenService.verify(userToken);
      return this.matchRoles(roles, payloadToken.role);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private matchRoles(rolesList: string[], userRole: string): boolean {
    if (rolesList.includes(userRole)) return true;
    return false;
  }

  private extractBearerTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
