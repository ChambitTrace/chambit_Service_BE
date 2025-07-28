import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/core/pipes/validation';
import { JsonResponse } from 'src/core/utils/json-response';

import { AuthService } from '../service/auth.service';
import { LoginDto, SignUpDto } from '../dto/auth.dto';
import {
  SignUpSwagger,
  LoginSwagger,
} from 'src/core/swagger/decorator/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(CustomValidationPipe)
  @ApiOperation({ summary: '회원가입' })
  @SignUpSwagger()
  async signUp(@Body() dto: SignUpDto) {
    const result = await this.authService.signUp(dto.email, dto.password);

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  @Post('login')
  @UsePipes(CustomValidationPipe)
  @ApiOperation({ summary: '로그인' })
  @LoginSwagger()
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.email, dto.password);

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }
}
