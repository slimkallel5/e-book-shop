import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ARTICLE_REPOSITORY,
  ORDER_REPOSITORY,
  PACK_REPOSITORY,
  REVIEW_REPOSITORY,
} from '../repositories/repository.module';
import {
  IArticleRepository,
  IOrderRepository,
  IPackRepository,
  IReviewRepository,
} from '../repositories/repository.interface';

@ApiTags('Admin Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(
    @Inject(ARTICLE_REPOSITORY) private articleRepo: IArticleRepository,
    @Inject(PACK_REPOSITORY) private packRepo: IPackRepository,
    @Inject(ORDER_REPOSITORY) private orderRepo: IOrderRepository,
    @Inject(REVIEW_REPOSITORY) private reviewRepo: IReviewRepository,
  ) {}

  @Get('stats')
  async getDashboardStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const activeArticles = await this.articleRepo.findAll({ activeOnly: true });
    const allArticles = await this.articleRepo.findAll({ activeOnly: false });
    const activePacks = await this.packRepo.findAll({ activeOnly: true });
    let allOrders = await this.orderRepo.findAll();
    const allReviews = await this.reviewRepo.findAll();

    // Date range filter for orders
    if (startDate) {
      const start = new Date(startDate).getTime();
      allOrders = allOrders.filter((o) => new Date(o.createdAt).getTime() >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      allOrders = allOrders.filter((o) => new Date(o.createdAt).getTime() <= end);
    }

    const totalArticles = activeArticles.length;
    const totalPacks = activePacks.length;
    const totalOrders = allOrders.length;

    // Breakdown orders by status
    const ordersByStatus = {
      pending: allOrders.filter((o) => o.status === 'pending').length,
      in_progress: allOrders.filter((o) => o.status === 'in_progress').length,
      delivered: allOrders.filter((o) => o.status === 'delivered').length,
      rejected: allOrders.filter((o) => o.status === 'rejected').length,
    };

    // Total Order Value (all created orders)
    const orderValue = allOrders.reduce((sum, o) => sum + o.total, 0);

    // Collected Revenue (only delivered orders and/or paid status)
    const collectedRevenue = allOrders
      .filter((o) => o.status === 'delivered' || o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    // Low stock alerts: articles with stock <= 10
    const lowStockArticles = allArticles.filter(
      (a) => a.stock !== undefined && a.stock !== null && a.stock <= 10,
    );

    // Recent 5 orders
    const recentOrders = allOrders.slice(0, 5);

    // Recent 5 reviews
    const latestReviews = allReviews.slice(0, 5);

    return {
      totalArticles,
      totalPacks,
      totalOrders,
      ordersByStatus,
      orderValue,
      collectedRevenue,
      lowStockArticles,
      recentOrders,
      latestReviews,
    };
  }
}
