import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  @IsEmail(
    { allow_display_name: false },
    { message: '이메일 형식이 올바르지 않습니다.' },
  )
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '123456',
  })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;
}

export class LoginRequestDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  @IsEmail(
    { allow_display_name: false },
    { message: '이메일 형식이 올바르지 않습니다.' },
  )
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '123456',
  })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  password: string;
}
