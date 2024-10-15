import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../../schemas/artist.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../../schemas/album.schema';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'IdExists', async: true })
@Injectable()
export class IdExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  async validate(id: string, args: ValidationArguments) {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const whichModel = args.constraints[0] as string;

    if (whichModel === 'artist') {
      const artist = await this.artistModel.findOne({ _id: id });
      return !!artist;
    } else if (whichModel === 'album') {
      const album = await this.albumModel.findOne({ _id: id });
      return !!album;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const modelName = args.constraints[0];
    return `${modelName} is not exist`;
  }
}

export function IdExists(
  modalName: string,
  validationOptions?: ValidationOptions,
) {
  return function (
    object: { constructor: CallableFunction },
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [modalName],
      validator: IdExistsConstraint,
    });
  };
}
