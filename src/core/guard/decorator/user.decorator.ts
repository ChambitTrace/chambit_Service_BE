import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  uId: string;
  uName: string;
  uEmail: string;
  uRole: string;
}

export interface OAuthUserInfo {
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

export const OAuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): OAuthUserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as OAuthUserInfo;
  },
);
