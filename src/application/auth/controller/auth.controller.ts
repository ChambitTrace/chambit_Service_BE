import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/core/pipes/validation';
import { JsonResponse } from 'src/core/utils/json-response';
import { AuthService } from '../service/auth.service';
import { LoginRequestDto, SignUpRequestDto } from '../dto/auth.dto';
import {
  SignUpSwagger,
  LoginSwagger,
  LogoutSwagger,
  GetUserInfoSwagger,
} from 'src/core/swagger/decorator/auth/auth.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { User, UserInfo } from 'src/core/guard/decorator/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(CustomValidationPipe)
  @ApiOperation({ summary: '회원가입' })
  @SignUpSwagger()
  async signUp(@Body() dto: SignUpRequestDto) {
    const result = await this.authService.signUp(dto.email, dto.password);

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  @Post('login')
  @UsePipes(CustomValidationPipe)
  @ApiOperation({ summary: '로그인' })
  @LoginSwagger()
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.authService.login(dto.email, dto.password);

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '로그아웃' })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer 액세스 토큰',
  })
  @ApiHeader({
		name: 'cookie',
		description: '리프레시 토큰이 포함된 쿠키',
  })
  @LogoutSwagger()
  async logout(@User() user: UserInfo) {
    await this.authService.logout(user.uId);

    const response = new JsonResponse();
    return response.of();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer 액세스 토큰',
  })
  @ApiHeader({
		name: 'cookie',
		description: '리프레시 토큰이 포함된 쿠키',
  })
  @GetUserInfoSwagger()
  async getUserInfo(@User() user: UserInfo) {
    const response = new JsonResponse();
    response.set('data', user);

    return response.of();
  }
}
