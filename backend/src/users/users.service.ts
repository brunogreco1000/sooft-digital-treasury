// backend/src/users/users.service.ts (Versión Corregida)

import { Injectable, ConflictException } from '@nestjs/common'; // <-- ¡Añadir ConflictException!
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(username: string, email: string, password: string): Promise<User> {
    
    // **********************************************
    // 1. VERIFICACIÓN DE UNICIDAD (LÓGICA CRUCIAL)
    // **********************************************
    const existingUser = await this.userModel.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (existingUser) {
        // Lanzamos una excepción 409 Conflict explícita
        throw new ConflictException('El nombre de usuario o email ya están registrados.');
    }

    // 2. Proceso de creación (si la verificación pasa)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, email, password: hashedPassword });
    
    // 3. Guardar en la DB
    return user.save();
  }

  async findByEmailOrUsername(value: string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ email: value }, { username: value }],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password');
  }
}