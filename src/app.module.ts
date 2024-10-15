import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Track, TrackSchema } from './schemas/track.schema';
import { TracksController } from './tracks/tracks.controller';
import { UsersController } from './users/users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { UniqueUserEmailConstraint } from './users/validators/unique-user-email.validator';
import { IdExistsConstraint } from './global/validators/id-exists.validator';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/music'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    ArtistsController,
    AlbumsController,
    TracksController,
    UsersController,
  ],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    UniqueUserEmailConstraint,
    IdExistsConstraint,
  ],
})
export class AppModule {}
