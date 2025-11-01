import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string, email: string, password: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario o email ya están registrados.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, email, password: hashedPassword });

    return user.save();
  }

  async findByEmailOrUsername(value: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ email: value }, { username: value }],
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password');
  }
}
