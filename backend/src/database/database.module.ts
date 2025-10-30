import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

if (!process.env.MONGO_URI) throw new Error('MONGO_URI no definido');

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
