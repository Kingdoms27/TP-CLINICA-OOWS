import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario } from '../common/enums/estado-usuario.enum';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario =
      await this.usuariosService.buscarPorUsernameConPassword(dto.username);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValido = await bcrypt.compare(
      dto.password,
      usuario.password,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      rol: usuario.rol,
    });

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        username: usuario.username,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    };
  }
}
