import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(@InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>) {}

  async create(userId: string, dto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = new this.portfolioModel({ ...dto, userId: new Types.ObjectId(userId) });
    return portfolio.save();
  }

  async findAll(userId: string): Promise<Portfolio[]> {
    return this.portfolioModel.find({ userId }).exec();
  }

  async findById(userId: string, id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel.findOne({ _id: id, userId }).exec();
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }
}
