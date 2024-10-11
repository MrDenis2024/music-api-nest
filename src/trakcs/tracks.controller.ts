import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}
  @Get()
  async getAll(@Query('album') album: string) {
    return this.trackModel
      .find(album ? { album: album } : {})
      .sort({ number: 1 });
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
