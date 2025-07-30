import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  uId: string;
  uName: string;
  uEmail: string;
  uRole: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserInfo;
  },
);
