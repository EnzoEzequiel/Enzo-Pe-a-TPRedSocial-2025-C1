import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
  ) {}

  async getPostsByUser(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.postModel.aggregate([
      { $match: { date: { $gte: fromDate, $lte: toDate }, show: true } },
      { $group: { _id: '$username', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }

  async getCommentsByDate(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.postModel.aggregate([
      { $unwind: '$comments' },
      { $match: { 'comments.date': { $gte: fromDate, $lte: toDate }, show: true } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
  }

  async getCommentsByPost(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.postModel.aggregate([
      { $unwind: '$comments' },
      { $match: { 'comments.date': { $gte: fromDate, $lte: toDate }, show: true } },
      { $group: { _id: '$username', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }
}
