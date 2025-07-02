import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostDocument>,
  ) { }

  /**
   * Número de publicaciones por usuario en el rango [from, to]
   */
  async getPostsByUser(from: Date, to: Date): Promise<{ _id: string; count: number }[]> {
    return this.postModel.aggregate([
      {
        $match: {
          date: { $gte: from, $lte: to },
          show: true,
        },
      },
      {
        $group: {
          _id: '$username',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]).exec();
  }

  /**
   * Total de comentarios (sumados) en el rango [from, to]
   */
  async getCommentsByDate(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return this.postModel.aggregate([
      { $match: { show: true } },
      { $unwind: '$comments' },
      {
        $match: {
          'comments.date': {
            $gte: fromDate,
            $lte: toDate
          },
          'comments.deleted': { $ne: true }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$comments.date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  /**
   * Comentarios por publicación en el rango [from, to]
   */
  async getCommentsByPost(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return this.postModel.aggregate([
      { $match: { show: true } },
      { $unwind: '$comments' },
      {
        $match: {
          'comments.date': {
            $gte: fromDate,
            $lte: toDate
          },
          'comments.deleted': { $ne: true }
        }
      },
      {
        $group: {
          _id: "$_id",
          count: { $sum: 1 },
          title: { $first: "$content" } 
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 } 
    ]);
  }
}
