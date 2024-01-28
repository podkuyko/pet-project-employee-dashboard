import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DataBaseModule } from './dataBase/dataBase.module';
import { UsersModule } from './users/users.module';
import { CustomConfigModule } from './custom-config/config.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { TokenModule } from './token/token.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    CustomConfigModule,
    UsersModule,
    DataBaseModule,
    TokenModule,
    AuthModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
