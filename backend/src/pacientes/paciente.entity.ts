import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  usuario: Usuario;
}
