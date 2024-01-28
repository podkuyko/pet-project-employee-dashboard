import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  LoginDto,
  RegistrationDto,
  ResponseAccessToken,
  ResponseRegistrationDto,
} from './dto/auth.dto';
import { DefaultAuthorizedGuard } from './guards/default-authorized.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'регистрация',
    summary: 'регистрация',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'успешная регистрация',
    type: ResponseRegistrationDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'введеные данные не валидны || пользователь уже зарегистрирован',
  })
  @UsePipes(ValidationPipe)
  @Post('registration')
  async registration(
    @Body() dto: RegistrationDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<ResponseRegistrationDto, 'password'>> {
    return this.authService.registration(dto, response);
  }

  @ApiOperation({
    description: 'вход для пользователя',
    summary: 'вход для пользователя',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неправильный логин или пароль',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'введеные данные не прошли валидацию',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'успешная авторизация',
  })
  @UsePipes(ValidationPipe)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(dto, response);
  }

  @ApiOperation({
    description: 'получить все данные авторизированного пользователя',
    summary: 'получить все данные авторизированного пользователя',
  })
  @ApiBasicAuth('JWT-auth')
  @Get('who-am-i')
  async whoAmI(@Req() request: Request) {
    return this.authService.whoAmI(request);
  }

  @ApiBasicAuth('JWT-auth')
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'вы не авторизованы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'токены успешно заменены',
    type: ResponseAccessToken,
  })
  @ApiOperation({
    description:
      'обновляет access и refresh токены, новый refresh будет в cookies а access в теле ответа',
    summary: 'обновить токены',
  })
  @Get('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(request, response);
  }

  @ApiOperation({
    description: 'Удалить сессию и отчистить куки для выхода',
    summary: 'Удалить сессию и отчистить куки для выхода',
  })
  @ApiBasicAuth('JWT-auth')
  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(request, response);
  }

  @ApiOperation({
    description: 'тестовый end-point для проверки регистрации',
    summary: 'Протестирвоать регистрацию',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Вы авторизированны!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Вы НЕ авторизированны!',
  })
  @ApiBasicAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(DefaultAuthorizedGuard)
  @Get('test')
  test() {
    return 'вы авторизованы';
  }
}

