import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadoTurno } from '../common/enums/estado-turno.enum';
import { Medico } from '../medicos/medico.entity';
import { Paciente } from '../pacientes/paciente.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({
    type: 'simple-enum',
    enum: EstadoTurno,
    default: EstadoTurno.RESERVADO,
  })
  estado: EstadoTurno;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  valorConsultaReserva: string;

  @ManyToOne(() => Medico, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  medico: Medico;

  @ManyToOne(() => Paciente, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  paciente: Paciente;

  @CreateDateColumn()
  fechaReserva: Date;
}
