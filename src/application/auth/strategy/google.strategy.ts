// To install these packages, run:
// npm install @nestjs/passport passport passport-google-oauth20
// src/application/auth/strategy/google.strategy.ts
import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import googleConfig from '../../../config/oauth.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleConfig.KEY)
    private readonly config: ConfigType<typeof googleConfig>,
  ) {
    const strategyOptions: StrategyOptions = {
      clientID: config.googleClientId!,
      clientSecret: config.googleClientSecret!,
      callbackURL: config.googleCallbackUrl!,
      scope: ['email', 'profile'],
      passReqToCallback: false,
    };
    super(strategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
