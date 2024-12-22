import { User } from '@/database/entities/user.entity';
import { RefreshTokenDto } from '@/dto/auth.dto';
import { CreateUserDto } from '@/dto/users.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/guards/local-auth.guard';
import { Payload } from '@/interfaces/payload';
import { AuthService } from '@/services/auth.service';
import { UsersService } from '@/services/users.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return {
      access_token: this.authService.generateAccessToken(user),
      refresh_token: this.authService.generateRefreshToken(user),
    };
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.generateTokenByRefreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    const user = req.user as Payload;
    return this.usersService.findById(user?.userId);
  }
}
