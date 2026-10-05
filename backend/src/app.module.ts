import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { SeedModule } from './seed/seed.module';
import { TurnosModule } from './turnos/turnos.module';
import { UsuariosModule } from './usuarios/usuarios.module';

const databaseConfig = (): TypeOrmModuleOptions => {
  if (process.env.DB_TYPE === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE ?? 'clinica_oows',
      retryAttempts: 2,
      retryDelay: 1000,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC !== 'false',
    };
  }

  return {
    type: 'sqljs',
    autoSave: true,
    location: 'clinica-oows.sqlite',
    autoLoadEntities: true,
    synchronize: true,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    UsuariosModule,
    AuthModule,
    MedicosModule,
    PacientesModule,
    TurnosModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
