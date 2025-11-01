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

  async findByUser(userId: string): Promise<Risk> {
    const risk = await this.riskModel.findOne({ userId }).exec();
    if (!risk) throw new NotFoundException('Risk data not found');
    return risk;
  }
}
