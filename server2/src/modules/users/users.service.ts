import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('* Usuario no encontrado');
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async accessToken(user: UserEntity) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    );
    return token;
  }

  async refreshToken(user: UserEntity) {
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION },
    );
    return refreshToken;
  }

  async verifyResetPasswordToken(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      return payload;
    } catch (error) {
      return false;
    }
  }

  async recoverPassword(
    passwordRecoveryDto: PasswordRecoveryDto,
  ): Promise<UserEntity> {
    const { email } = passwordRecoveryDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('* Usuario no encontrado');
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        // Token expires in 1 hour
        expiresIn: '1h',
      },
    );

    // Save token in users database
    user.reset_password_token = resetToken;
    await this.usersRepository.save(user);

    // Generate URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send mail
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Recuperación de Contraseña',
        template: 'reset-password',
        context: {
          resetUrl,
        },
      });
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }

    return user;
  }

  async resetPassword(token: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { reset_password_token: token },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    user.reset_password_token = null;

    await this.usersRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async create(createUserDto: CreateUserDto): Promise<{ email: string }> {
    const userExists = await this.findUserByEmail(createUserDto.email);
    if (userExists)
      throw new BadRequestException('email: * Correo no disponible');
    createUserDto.password = await hash(createUserDto.password, 10);
    const user = this.usersRepository.create(createUserDto);

    const savedUser = await this.usersRepository.save(user);

    return { email: savedUser['email'] };
  }

  async signin(loginUserDto: AuthenticateUserDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: loginUserDto.email })
      .getOne();
    if (!userExists)
      throw new BadRequestException('password: * Usuario no registrado');
    const match = await compare(loginUserDto.password, userExists.password);
    if (!match)
      throw new BadRequestException(
        'password: * Las credenciales son incorrectas',
      );
    delete userExists.password;
    return userExists;
  }
}
