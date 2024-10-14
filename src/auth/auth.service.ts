import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await user.checkPassword(password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }
}
