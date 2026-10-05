import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EstadoUsuario } from '../common/enums/estado-usuario.enum';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; rol: string }) {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      username: usuario.username,
      rol: usuario.rol,
    };
  }
}
