// backend/src/database/database.module.ts (Versión Corregida)

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Importar ConfigModule y ConfigService

@Module({
  imports: [
    // 1. Necesitas importar ConfigModule (si aún no lo hiciste en app.module)
    // Para el ejemplo, asumimos que está disponible.

    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Asegurarse de que el ConfigModule esté disponible
      useFactory: async (configService: ConfigService) => ({
        // 2. Usar configService para leer la URI
        uri: configService.get<string>('MONGO_URI'),
        // 3. Opcionalmente, puedes añadir opciones de conexión aquí
      }),
      inject: [ConfigService], // Inyectar el servicio de configuración
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}