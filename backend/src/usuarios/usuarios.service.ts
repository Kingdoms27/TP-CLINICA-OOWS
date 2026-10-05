import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  buscarPorUsernameConPassword(username: string) {
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.username = :username', { username })
      .getOne();
  }

  async buscarPorId(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }
}
