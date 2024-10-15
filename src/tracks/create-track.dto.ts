import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IdExists } from '../global/validators/id-exists.validator';

export class CreateTrackDto {
  @IsMongoId()
  @IdExists('album')
  album: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  number: number;
}
