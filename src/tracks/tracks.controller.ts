import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  async getAll(@Query('album') album: string) {
    return this.trackModel
      .find(album ? { album: album } : {})
      .sort({ number: 1 });
  }
  @Post()
  async create(@Body() trackData: CreateTrackDto) {
    const album = await this.albumModel.findOne({ _id: trackData.album });
    if (!album) {
      throw new NotFoundException(`Album does not exist`);
    }
    try {
      return await this.trackModel.create({
        album: trackData.album,
        name: trackData.name,
        duration: trackData.duration,
        number: trackData.number,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const track = await this.trackModel.findOne({ _id: id });
    if (!track) {
      throw new NotFoundException(`Track not found`);
    }
    await this.trackModel.deleteOne({ _id: id });
    return { message: 'Track deleted successfully.' };
  }
}
