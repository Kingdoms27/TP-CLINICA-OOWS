import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico.entity';
import { MedicosController } from './medicos.controller';
import { MedicosService } from './medicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicosController],
  providers: [MedicosService],
  exports: [MedicosService, TypeOrmModule],
})
export class MedicosModule {}
