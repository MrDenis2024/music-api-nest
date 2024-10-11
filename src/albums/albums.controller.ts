import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';

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
