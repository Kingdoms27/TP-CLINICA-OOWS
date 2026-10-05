import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from '../medicos/medico.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Medico, Paciente]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
