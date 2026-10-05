import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  usuario: Usuario;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  valorConsulta: string;
}
