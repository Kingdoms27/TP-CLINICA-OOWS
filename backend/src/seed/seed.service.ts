import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { EstadoUsuario } from '../common/enums/estado-usuario.enum';
import { Rol } from '../common/enums/rol.enum';
import { Medico } from '../medicos/medico.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Medico)
    private readonly medicosRepository: Repository<Medico>,
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
  ) {}

  async onApplicationBootstrap() {
    const cantidad = await this.usuariosRepository.count();

    if (cantidad > 0) {
      return;
    }

    const admin = await this.crearUsuario(
      'Administrador',
      'Clínica',
      'admin',
      'Admin123!',
      Rol.ADMINISTRADOR,
    );

    const medicoUsuario = await this.crearUsuario(
      'María',
      'Gómez',
      'medico',
      'Medico123!',
      Rol.MEDICO,
    );

    const pacienteUsuario = await this.crearUsuario(
      'Juan',
      'Pérez',
      'paciente',
      'Paciente123!',
      Rol.PACIENTE,
    );

    await this.medicosRepository.save(
      this.medicosRepository.create({
        usuario: medicoUsuario,
        valorConsulta: '30000.00',
      }),
    );

    await this.pacientesRepository.save(
      this.pacientesRepository.create({
        usuario: pacienteUsuario,
      }),
    );

    void admin;
  }

  private async crearUsuario(
    nombre: string,
    apellido: string,
    username: string,
    password: string,
    rol: Rol,
  ) {
    return this.usuariosRepository.save(
      this.usuariosRepository.create({
        nombre,
        apellido,
        username,
        password: await bcrypt.hash(password, 10),
        rol,
        estado: EstadoUsuario.ACTIVO,
      }),
    );
  }
}
