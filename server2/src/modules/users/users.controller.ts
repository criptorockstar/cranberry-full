import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthorizeGuard } from 'src/common/guards/authorization.guard';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PasswordResetGuard } from 'src/common/guards/password-reset.guard';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { RefreshUser } from 'src/common/decorators/refresh-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { VerifyResetPasswordTokenDto } from './dto/verify-reset.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RefreshGuard)
  @Get('/refresh')
  async refresh(@RefreshUser() refreshUser: UserEntity) {
    const user = refreshUser;
    const accessToken = await this.usersService.accessToken(user);
    const refreshToken = await this.usersService.refreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Post('/sign-up')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ email: string }> {
    const email = await this.usersService.create(createUserDto);
    return email;
  }

  @Post('/sign-in')
  async signin(@Body() loginUserDto: AuthenticateUserDto): Promise<{
    email: string;
    role: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.signin(loginUserDto);

    const accessToken = await this.usersService.accessToken(user);
    const refreshToken = await this.usersService.refreshToken(user);

    return {
      email: user.email,
      role: user.roles,
      accessToken,
      refreshToken,
    };
  }

  @Post('/password-recovery')
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    await this.usersService.recoverPassword(passwordRecoveryDto);
    return {
      message: 'Se ha enviado un correo de recuperación.',
    };
  }

  @UseGuards(PasswordResetGuard)
  @Post('/verify-reset-password-token')
  async verifyResetPasswordToken(
    @Body() VerifyResetPasswordTokenDto: VerifyResetPasswordTokenDto,
  ) {
    const { token } = VerifyResetPasswordTokenDto;
    const isValid = await this.usersService.verifyResetPasswordToken(token);
    return { isValid };
  }

  @UseGuards(PasswordResetGuard)
  @Post('password-reset')
  async passwordReset(
    @Body() passwordResetDto: PasswordResetDto,
    @Headers('authorization') authorization: string,
  ) {
    const { password } = passwordResetDto;

    // Extract token from Bearer
    const token = authorization.split(' ')[1];

    // Perform updates
    const result = await this.usersService.resetPassword(token, password);

    return result;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/verify-token')
  async veryfyToken(@CurrentUser() currentUser: UserEntity) {
    return { isValid: !!currentUser };
  }

  @UseGuards(AuthenticationGuard)
  @Get('/logout')
  async logout(@CurrentUser() currentUser: UserEntity) {
    return {
      logout: true,
    };
  }

  @UseGuards(AuthenticationGuard)
  @UseGuards(AuthorizeGuard(['Admin']))
  @Get('/isadmin')
  async veryfyRole(@CurrentUser() currentUser: UserEntity) {
    return currentUser.roles;
  }
}
