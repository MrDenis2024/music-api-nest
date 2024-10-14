import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@ValidatorConstraint({ name: 'uniqueUserEmail', async: true })
@Injectable()
export class UniqueUserEmailConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validate(email: string) {
    const user = await this.userModel.findOne({ email });
    return !user;
  }

  defaultMessage(): string {
    return 'Email is already in use!';
  }
}

export function UniqueUserEmail(validationOptions?: ValidationOptions) {
  return function (
    object: { constructor: CallableFunction },
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUserEmailConstraint,
    });
  };
}
