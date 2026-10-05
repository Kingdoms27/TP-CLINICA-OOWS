import { IsNumber, Min } from 'class-validator';

export class ActualizarValorDto {
  @IsNumber()
  @Min(0)
  valor: number;
}
