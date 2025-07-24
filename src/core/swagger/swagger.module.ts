import { Module } from '@nestjs/common';
import { SwaggerConfig } from '../../config/swagger.config';

@Module({
  imports: [],
  providers: [SwaggerConfig],
  exports: [SwaggerConfig],
})
export class SwaggerModule {}
