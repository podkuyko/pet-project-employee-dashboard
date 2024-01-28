import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Users } from 'src/users/users.entity';
import { Tokens } from './token.entity';

type GetObjDifferentKeys<T, U> = Omit<T, keyof U> & Omit<U, keyof T>;

type PayloadAccessJWT = Pick<Users, 'email' | 'id' | 'role'>;
type PayloadRefreshJWT = GetObjDifferentKeys<PayloadAccessJWT, { jti: number }>;

type CreateToken = Pick<Tokens, 'user'>;

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Tokens)
    private tokenRepository: Repository<Tokens>,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: PayloadAccessJWT) {
    const newRefreshToken = await this.saveToken({ user: user.id });

    const payloadAccessToken: PayloadAccessJWT = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const payloadRefreshToken: PayloadRefreshJWT = {
      ...payloadAccessToken,
      jti: newRefreshToken.id,
    };

    const access_token = `Bearer ${await this.jwtService.signAsync(
      payloadAccessToken,
      {
        expiresIn: '10d',
      },
    )}`;

    const refresh_token = `Bearer ${await this.jwtService.signAsync(
      payloadRefreshToken,
      { expiresIn: '30d' },
    )}`;

    return { access_token, refresh_token };
  }

  async saveToken({ user }: CreateToken) {
    return await this.tokenRepository.save({ user });
  }

  async deleteToken(token: string) {
    const decodeToken = this.jwtService.decode(token) as
      | PayloadAccessJWT
      | PayloadRefreshJWT;

    return await this.tokenRepository.delete({ id: decodeToken?.id });
  }

  async decode(tokenWithBearer: string) {
    const [_, tokenWithoutBearer] = tokenWithBearer.split(' ');
    return this.jwtService.decode(tokenWithoutBearer) as
      | PayloadAccessJWT
      | PayloadRefreshJWT;
  }

  async verify(
    tokenWithBearer: string,
  ): Promise<PayloadAccessJWT | PayloadRefreshJWT> | never {
    return this.jwtService.verify(tokenWithBearer);
  }
}
