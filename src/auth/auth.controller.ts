import { Controller, Post, HttpStatus, HttpCode, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './interfaces/login.interface';
import { User } from '../users/interfaces/user.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {default as config} from '../config';
import { getNowDate } from 'common/utils/date';

@ApiTags('用户相关接口')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService ) {}

  @ApiOperation({ summary: '登录接口', description: '使用邮箱和密码登录'})
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: Login): Promise<IResponse> {
    try {
      var response = await this.authService.validateLogin(login.email, login.password);
      return new ResponseSuccess("登录成功", response);
    } catch(error) {
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: '注册接口'})
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      var newUser = new UserDto(await this.userService.createNewUser(createUserDto));
      await this.authService.createEmailToken(newUser.email);
      //await this.authService.saveUserConsent(newUser.email); //[GDPR user content]
      var sent = await this.authService.sendEmailVerification(newUser.email);
      if(sent){
        return new ResponseSuccess("注册成功");
      } else {
        return new ResponseError('注册失败', null);
      }
    } catch(error){
      return new ResponseError(error.message, null, error.status);
    }
  }

  @ApiOperation({ summary: '邮箱验证'})
  @Get('email/verify/:token')
  public async verifyEmail(@Param() params): Promise<any> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(params.token);
      let str = `<div style="width: 100%;height: 300px;display:flex; justify-content: center;align-items: center;font-size: 25px;">
                  <p>邮箱验证通过啦!  </p>
                  <a style="text-decoration: none" href="${config.host.url}">点击链接立即返回>></a>
                </div>`
      return str;
    } catch(error) {
      let str = `<div style="width: 100%;height: 300px;display:flex; justify-content: center;align-items: center;font-size: 25px;">
                  <p>该验证链接已失效!  </p>
                </div>`
      return str;
    }
  }
  @ApiOperation({ summary: '重发邮箱验证链接'})
  @Get('email/resend-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<IResponse> {
    try {
      await this.authService.createEmailToken(params.email);
      var isEmailSent = await this.authService.sendEmailVerification(params.email);
      if(isEmailSent){
        return new ResponseSuccess("邮箱验证链接重发成功", null);
      } else {
        return new ResponseError("该邮箱尚未注册", null, 404);
      }
    } catch(error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
  @ApiOperation({ summary: '忘记密码'})
  @Get('email/forgot-password/:email')
  public async sendEmailForgotPassword(@Param() params): Promise<IResponse> {
    try {
      var isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError(error.message, null, error.status);
    }
  }
  @ApiOperation({ summary: '重置密码'})
  @Post('email/reset-password')
  @HttpCode(HttpStatus.OK)
  public async setNewPassord(@Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
    try {
      var isNewPasswordChanged : boolean = false;
      if(resetPassword.email && resetPassword.currentPassword){
        var isValidPassword = await this.authService.checkPassword(resetPassword.email, resetPassword.currentPassword);
        if(isValidPassword) {
          isNewPasswordChanged = await this.userService.setPassword(resetPassword.email, resetPassword.newPassword);
        } else {
          return new ResponseError("RESET_PASSWORD.WRONG_CURRENT_PASSWORD");
        }
      } else if (resetPassword.newPasswordToken) {
        var forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.newPasswordToken);
        isNewPasswordChanged = await this.userService.setPassword(forgottenPasswordModel.email, resetPassword.newPassword);
        if(isNewPasswordChanged) await forgottenPasswordModel.remove();
      } else {
        return new ResponseError('设置密码失败', null, 500);
      }
      return new ResponseSuccess("RESET_PASSWORD.PASSWORD_CHANGED", isNewPasswordChanged);
    } catch(error) {
      return new ResponseError('重置密码失败', error, 500);
    }
  }

}
