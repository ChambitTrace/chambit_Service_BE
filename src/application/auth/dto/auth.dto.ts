import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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

export class LoginDto {
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
