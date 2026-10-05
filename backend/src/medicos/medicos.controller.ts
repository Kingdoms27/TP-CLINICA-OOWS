import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActualizarValorDto } from './dto/actualizar-valor.dto';
import { MedicosService } from './medicos.service';

@Controller('medicos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Get()
  listar() {
    return this.medicosService.listar();
  }

  @Patch(':id/valor')
  @Roles(Rol.ADMINISTRADOR)
  actualizarValor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarValorDto,
  ) {
    return this.medicosService.actualizarValor(id, dto);
  }
}
