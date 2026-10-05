import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  me(@UsuarioActual() usuario: { id: number }) {
    return this.usuariosService.buscarPorId(usuario.id);
  }
}
