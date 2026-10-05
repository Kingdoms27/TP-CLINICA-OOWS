import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { Rol } from '../common/enums/rol.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActualizarEstadoTurnoDto } from './dto/actualizar-estado-turno.dto';
import { ReservarTurnoDto } from './dto/reservar-turno.dto';
import { TurnosService } from './turnos.service';

@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get('disponibilidad')
  @Roles(Rol.PACIENTE, Rol.ADMINISTRADOR)
  disponibilidad(
    @Query('medicoId', ParseIntPipe) medicoId: number,
    @Query('fecha') fecha: string,
  ) {
    return this.turnosService.disponibilidad(medicoId, fecha);
  }

  @Post()
  @Roles(Rol.PACIENTE, Rol.ADMINISTRADOR)
  reservar(
    @UsuarioActual() usuario: { id: number; rol: Rol },
    @Body() dto: ReservarTurnoDto,
  ) {
    return this.turnosService.reservar(usuario, dto);
  }

  @Get('mis-turnos')
  @Roles(Rol.PACIENTE)
  misTurnos(@UsuarioActual() usuario: { id: number }) {
    return this.turnosService.misTurnos(usuario.id);
  }

  @Get('medico')
  @Roles(Rol.MEDICO)
  turnosMedico(
    @UsuarioActual() usuario: { id: number },
    @Query('fecha') fecha: string,
  ) {
    return this.turnosService.turnosMedico(usuario.id, fecha);
  }

  @Get()
  @Roles(Rol.ADMINISTRADOR)
  listarTodos(@Query('fecha') fecha?: string) {
    return this.turnosService.listarTodos(fecha);
  }

  @Patch(':id/cancelar')
  @Roles(Rol.PACIENTE, Rol.ADMINISTRADOR)
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number; rol: Rol },
  ) {
    return this.turnosService.cancelar(id, usuario);
  }

  @Patch(':id/estado')
  @Roles(Rol.MEDICO)
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number },
    @Body() dto: ActualizarEstadoTurnoDto,
  ) {
    return this.turnosService.actualizarEstadoMedico(
      id,
      usuario.id,
      dto,
    );
  }
}
