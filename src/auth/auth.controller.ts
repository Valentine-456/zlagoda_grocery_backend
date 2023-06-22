import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any> = null) {
    if (!signInDto.id_employee || !signInDto.password)
      throw new BadRequestException();
    return this.authService.signIn(signInDto.id_employee, signInDto.password);
  }
}
