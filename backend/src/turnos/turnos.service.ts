import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { EstadoTurno } from '../common/enums/estado-turno.enum';
import { Rol } from '../common/enums/rol.enum';
import { MedicosService } from '../medicos/medicos.service';
import { PacientesService } from '../pacientes/pacientes.service';
import { ActualizarEstadoTurnoDto } from './dto/actualizar-estado-turno.dto';
import { ReservarTurnoDto } from './dto/reservar-turno.dto';
import { Turno } from './turno.entity';

type UsuarioSesion = {
  id: number;
  rol: Rol;
};

@Injectable()
export class TurnosService {
  private readonly horarios = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
  ];

  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
    private readonly medicosService: MedicosService,
    private readonly pacientesService: PacientesService,
  ) {}

  private fechaLocal(fecha: string) {
    return new Date(`${fecha}T00:00:00`);
  }

  private hoySinHora() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }

  private validarFechaReserva(fecha: string) {
    const fechaTurno = this.fechaLocal(fecha);
    const hoy = this.hoySinHora();
    const limite = new Date(hoy);

    limite.setDate(limite.getDate() + 30);

    if (Number.isNaN(fechaTurno.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    if (fechaTurno < hoy) {
      throw new BadRequestException('No se pueden reservar fechas pasadas');
    }

    if (fechaTurno > limite) {
      throw new BadRequestException(
        'La reserva no puede superar los 30 días de anticipación',
      );
    }
  }

  private validarHorario(hora: string) {
    const normalizada = hora.slice(0, 5);

    if (!this.horarios.includes(normalizada)) {
      throw new BadRequestException(
        'El horario debe estar comprendido entre las 08:00 y las 15:00',
      );
    }

    return normalizada;
  }

  private inicioTurno(fecha: string, hora: string) {
    return new Date(`${fecha}T${hora.slice(0, 5)}:00`);
  }

  private horarioYaPaso(fecha: string, hora: string) {
    return this.inicioTurno(fecha, hora) <= new Date();
  }

  async disponibilidad(medicoId: number, fecha: string) {
    this.validarFechaReserva(fecha);
    await this.medicosService.buscarPorId(medicoId);

    const ocupados = await this.turnosRepository.find({
      where: {
        medico: {
          id: medicoId,
        },
        fecha,
        estado: Not(EstadoTurno.CANCELADO),
      },
    });

    const horasOcupadas = new Set(
      ocupados.map((turno) => turno.hora.slice(0, 5)),
    );

    return this.horarios.map((hora) => ({
      hora,
      disponible:
        !horasOcupadas.has(hora) &&
        !this.horarioYaPaso(fecha, hora),
    }));
  }

  async reservar(usuario: UsuarioSesion, dto: ReservarTurnoDto) {
    this.validarFechaReserva(dto.fecha);

    const hora = this.validarHorario(dto.hora);

    if (this.horarioYaPaso(dto.fecha, hora)) {
      throw new BadRequestException(
        'No se puede reservar un horario que ya pasó',
      );
    }

    const medico = await this.medicosService.buscarPorId(dto.medicoId);

    let paciente;

    if (usuario.rol === Rol.PACIENTE) {
      paciente = await this.pacientesService.buscarPorUsuarioId(usuario.id);
    } else if (usuario.rol === Rol.ADMINISTRADOR) {
      if (!dto.pacienteId) {
        throw new BadRequestException(
          'El administrador debe indicar el paciente',
        );
      }

      paciente = await this.pacientesService.buscarPorId(dto.pacienteId);
    } else {
      throw new ForbiddenException('No puede reservar turnos');
    }

    const existente = await this.turnosRepository.findOne({
      where: {
        medico: {
          id: medico.id,
        },
        fecha: dto.fecha,
        hora,
        estado: Not(EstadoTurno.CANCELADO),
      },
    });

    if (existente) {
      throw new BadRequestException('El horario ya se encuentra reservado');
    }

    const turno = this.turnosRepository.create({
      fecha: dto.fecha,
      hora,
      estado: EstadoTurno.RESERVADO,
      valorConsultaReserva: medico.valorConsulta,
      medico,
      paciente,
    });

    return this.turnosRepository.save(turno);
  }

  async misTurnos(usuarioId: number) {
    const paciente =
      await this.pacientesService.buscarPorUsuarioId(usuarioId);

    return this.turnosRepository.find({
      where: {
        paciente: {
          id: paciente.id,
        },
      },
      order: {
        fecha: 'ASC',
        hora: 'ASC',
      },
    });
  }

  async turnosMedico(usuarioId: number, fecha: string) {
    const medico = await this.medicosService.buscarPorUsuarioId(usuarioId);

    return this.turnosRepository.find({
      where: {
        medico: {
          id: medico.id,
        },
        fecha,
      },
      order: {
        hora: 'ASC',
      },
    });
  }

  listarTodos(fecha?: string) {
    return this.turnosRepository.find({
      where: fecha ? { fecha } : {},
      order: {
        fecha: 'ASC',
        hora: 'ASC',
      },
    });
  }

  async cancelar(id: number, usuario: UsuarioSesion) {
    const turno = await this.turnosRepository.findOne({
      where: { id },
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    if (turno.estado !== EstadoTurno.RESERVADO) {
      throw new BadRequestException('El turno ya no se puede cancelar');
    }

    if (usuario.rol === Rol.PACIENTE) {
      const paciente =
        await this.pacientesService.buscarPorUsuarioId(usuario.id);

      if (turno.paciente.id !== paciente.id) {
        throw new ForbiddenException('El turno no pertenece al paciente');
      }

      const fechaTurno = this.fechaLocal(turno.fecha);

      if (fechaTurno <= this.hoySinHora()) {
        throw new BadRequestException(
          'El paciente solo puede cancelar hasta el día anterior',
        );
      }
    } else if (usuario.rol === Rol.ADMINISTRADOR) {
      const inicio = this.inicioTurno(turno.fecha, turno.hora);

      if (inicio <= new Date()) {
        throw new BadRequestException(
          'El turno ya comenzó y no puede cancelarse',
        );
      }
    } else {
      throw new ForbiddenException('No puede cancelar turnos');
    }

    turno.estado = EstadoTurno.CANCELADO;
    return this.turnosRepository.save(turno);
  }

  async actualizarEstadoMedico(
    id: number,
    usuarioId: number,
    dto: ActualizarEstadoTurnoDto,
  ) {
    if (
      dto.estado !== EstadoTurno.ATENDIDO &&
      dto.estado !== EstadoTurno.AUSENTE
    ) {
      throw new BadRequestException(
        'El médico solo puede marcar ATENDIDO o AUSENTE',
      );
    }

    const medico = await this.medicosService.buscarPorUsuarioId(usuarioId);
    const turno = await this.turnosRepository.findOne({
      where: { id },
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    if (turno.medico.id !== medico.id) {
      throw new ForbiddenException('El turno no pertenece al médico');
    }

    if (turno.estado !== EstadoTurno.RESERVADO) {
      throw new BadRequestException('El turno ya fue procesado');
    }

    turno.estado = dto.estado;
    return this.turnosRepository.save(turno);
  }
}
