import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Risk, RiskDocument } from './schemas/risk.schema';
import { CreateRiskDto } from './dto/create-risk.dto';

@Injectable()
export class RiskService {
  constructor(@InjectModel(Risk.name) private riskModel: Model<RiskDocument>) {}

  async create(userId: string, dto: CreateRiskDto): Promise<Risk> {
    const risk = new this.riskModel({ ...dto, userId: new Types.ObjectId(userId) });
    return risk.save();
  }

  async findByUser(userId: string): Promise<Risk[]> {
    const risks = await this.riskModel.find({ userId: new Types.ObjectId(userId) }).exec();
    if (!risks || risks.length === 0) throw new NotFoundException('No se encontraron riesgos');
    return risks;
  }
}
