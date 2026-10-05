import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './medico.entity';
import { ActualizarValorDto } from './dto/actualizar-valor.dto';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicosRepository: Repository<Medico>,
  ) {}

  listar() {
    return this.medicosRepository.find({
      order: {
        usuario: {
          apellido: 'ASC',
          nombre: 'ASC',
        },
      },
    });
  }

  async buscarPorId(id: number) {
    const medico = await this.medicosRepository.findOne({
      where: { id },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    return medico;
  }

  async buscarPorUsuarioId(usuarioId: number) {
    const medico = await this.medicosRepository.findOne({
      where: {
        usuario: {
          id: usuarioId,
        },
      },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    return medico;
  }

  async actualizarValor(id: number, dto: ActualizarValorDto) {
    const medico = await this.buscarPorId(id);
    medico.valorConsulta = dto.valor.toFixed(2);
    return this.medicosRepository.save(medico);
  }
}
