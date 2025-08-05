import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  uId: string;
  uName: string;
  uEmail: string;
  uRole: string;
}

export interface OAuthUser {
  email: string;
  name: string;
  picture: string;
  accessToken: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserInfo;
  },
);