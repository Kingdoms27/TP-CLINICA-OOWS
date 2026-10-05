import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  estado() {
    return {
      sistema: 'Clínica OOWS',
      estado: 'online',
    };
  }
}
