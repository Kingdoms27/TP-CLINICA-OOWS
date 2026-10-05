import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class ReservarTurnoDto {
  @IsInt()
  @Min(1)
  medicoId: number;

  @IsDateString()
  fecha: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  hora: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pacienteId?: number;
}
