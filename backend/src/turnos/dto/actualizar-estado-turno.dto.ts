import { IsEnum } from 'class-validator';
import { EstadoTurno } from '../../common/enums/estado-turno.enum';

export class ActualizarEstadoTurnoDto {
  @IsEnum(EstadoTurno)
  estado: EstadoTurno;
}
