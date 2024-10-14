import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = new this.userModel({
      email: registerUserDto.email,
      password: registerUserDto.password,
      displayName: registerUserDto.displayName,
    });
    user.generateToken();

    return await user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return req.user;
  }

  @Delete('sessions')
  async logout(@Req() req: Request) {
    const handleValue = req.get('Authorization');

    if (!handleValue) {
      return;
    }

    const [, token] = handleValue.split(' ');

    if (!token) {
      return;
    }

    const user = await this.userModel.findOne({ token });

    if (!user) {
      return;
    }

    user.generateToken();
    await user.save();

    return;
  }
}
