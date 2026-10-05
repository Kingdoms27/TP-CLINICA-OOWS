import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoUsuario } from '../common/enums/estado-usuario.enum';
import { Rol } from '../common/enums/rol.enum';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  nombre: string;

  @Column({ length: 80 })
  apellido: string;

  @Column({ unique: true, length: 80 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'simple-enum',
    enum: Rol,
  })
  rol: Rol;

  @Column({
    type: 'simple-enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario;
}
