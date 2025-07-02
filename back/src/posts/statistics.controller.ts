import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('posts-by-user')
  @Roles('admin')
  getPostsByUser(
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.statisticsService.getPostsByUser(fromDate, toDate);
  }

  @Get('comments-by-date')
  @Roles('admin')
  getCommentsByDate(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.statisticsService.getCommentsByDate(from, to);
  }

  @Get('comments-by-post')
  @Roles('admin')
  getCommentsByPost(
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    return this.statisticsService.getCommentsByPost(from, to);
  }
}
