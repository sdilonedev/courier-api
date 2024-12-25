import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './services/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { PackageService } from './services/package.service';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { PackageController } from './controllers/package.controller';
import { ConfigModule } from '@nestjs/config';
import config from '@/config/config';
import { PassportModule } from '@nestjs/passport';
import { BranchService } from './services/branch.service';
import { BranchController } from './controllers/branch.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60s' },
      }),
    }),
    DatabaseModule,
  ],
  controllers: [
    UsersController,
    AuthController,
    PackageController,
    BranchController,
  ],
  providers: [
    UsersService,
    AuthService,
    PackageService,
    BranchService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
