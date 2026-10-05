import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { PacientesService } from './pacientes.service';

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  @Roles(Rol.ADMINISTRADOR)
  listar() {
    return this.pacientesService.listar();
  }
}
