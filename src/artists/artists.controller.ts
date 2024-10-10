import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { promises as fs } from 'fs';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  async getAll() {
    return this.artistModel.find();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.artistModel.findOne({ _id: id });
    if (!artist) {
      throw new NotFoundException(`Artist not found`);
    }
    return artist;
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const destDir = join('./public/images', 'artists');
          await fs.mkdir(destDir, { recursive: true });
          cb(null, destDir);
        },
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const newFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
          cb(null, newFilename);
        },
      }),
    }),
  )
  async create(
    @Body() artistData: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.artistModel.create({
      name: artistData.name,
      information: artistData.information ? artistData.information : null,
      image: file ? 'images/artists/' + file.filename : null,
    });
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const artist = await this.artistModel.findOne({ _id: id });
    if (!artist) {
      throw new NotFoundException(`Artist not found`);
    }
    await this.artistModel.deleteOne({ _id: id });
    return { message: 'Artist deleted successfully.' };
  }
}