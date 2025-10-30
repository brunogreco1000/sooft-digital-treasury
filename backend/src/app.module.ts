import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here (even if global)
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Use ConfigService.get()
      }),
      inject: [ConfigService],
    }),
    // ... other modules
  ],
})
export class AppModule {}