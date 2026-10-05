import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
  ) {}

  listar() {
    return this.pacientesRepository.find({
      order: {
        usuario: {
          apellido: 'ASC',
          nombre: 'ASC',
        },
      },
    });
  }

  async buscarPorId(id: number) {
    const paciente = await this.pacientesRepository.findOne({
      where: { id },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return paciente;
  }

  async buscarPorUsuarioId(usuarioId: number) {
    const paciente = await this.pacientesRepository.findOne({
      where: {
        usuario: {
          id: usuarioId,
        },
      },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return paciente;
  }
}
