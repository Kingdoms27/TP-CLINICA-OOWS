import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosModule } from '../medicos/medicos.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { Turno } from './turno.entity';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno]),
    MedicosModule,
    PacientesModule,
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
})
export class TurnosModule {}
