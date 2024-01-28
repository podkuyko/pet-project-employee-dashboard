import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './validation';
import { configuration } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/custom-config/.env`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class CustomConfigModule {}
