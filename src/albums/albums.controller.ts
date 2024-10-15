import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import { CreateAlbumDto } from './create-album.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RoleGuard } from '../auth/role.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll(@Query('artist') artist: string) {
    return this.albumModel
      .find(artist ? { artist: artist } : {})
      .sort({ year: -1 });
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findOne({ _id: id });
    if (!album) {
      throw new NotFoundException(`Album not found`);
    }
    return album;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const destDir = join('./public/images', 'albums');
          await fs.mkdir(destDir, { recursive: true });
          cb(null, destDir);
        },
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const newFilename = randomUUID() + extension;
          cb(null, newFilename);
        },
      }),
    }),
  )
  async create(
    @Body() albumData: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.albumModel.create({
      artist: albumData.artist,
      title: albumData.title,
      year: albumData.year,
      image: file ? 'images/albums/' + file.filename : null,
    });
  }

  @UseGuards(TokenAuthGuard, new RoleGuard(['admin']))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const album = await this.albumModel.findOne({ _id: id });
    if (!album) {
      throw new NotFoundException(`Album not found`);
    }
    await this.albumModel.deleteOne({ _id: id });
    return { message: 'Album deleted successfully.' };
  }
}
