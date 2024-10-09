import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  duration: string;
  @Prop({ required: true })
  number: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
