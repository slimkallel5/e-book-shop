import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  JsonArticleRepository,
  JsonContactRepository,
  JsonDeliveryRuleRepository,
  JsonEducationLevelRepository,
  JsonOrderRepository,
  JsonPackRepository,
  JsonReviewRepository,
} from './json/json-repositories';
import {
  PostgresArticleRepository,
  PostgresContactRepository,
  PostgresDeliveryRuleRepository,
  PostgresEducationLevelRepository,
  PostgresOrderRepository,
  PostgresPackRepository,
  PostgresReviewRepository,
} from './postgres/postgres-repositories';
import { PrismaService } from './postgres/prisma.service';

export const EDUCATION_LEVEL_REPOSITORY = 'EDUCATION_LEVEL_REPOSITORY';
export const ARTICLE_REPOSITORY = 'ARTICLE_REPOSITORY';
export const PACK_REPOSITORY = 'PACK_REPOSITORY';
export const DELIVERY_RULE_REPOSITORY = 'DELIVERY_RULE_REPOSITORY';
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export const REVIEW_REPOSITORY = 'REVIEW_REPOSITORY';
export const CONTACT_REPOSITORY = 'CONTACT_REPOSITORY';

@Module({})
export class RepositoryModule {
  static register(): DynamicModule {
    const isPostgres = process.env.DATA_STORE === 'postgres';

    const providers: Provider[] = [
      PrismaService,
      {
        provide: EDUCATION_LEVEL_REPOSITORY,
        useClass: isPostgres ? PostgresEducationLevelRepository : JsonEducationLevelRepository,
      },
      {
        provide: ARTICLE_REPOSITORY,
        useClass: isPostgres ? PostgresArticleRepository : JsonArticleRepository,
      },
      {
        provide: PACK_REPOSITORY,
        useClass: isPostgres ? PostgresPackRepository : JsonPackRepository,
      },
      {
        provide: DELIVERY_RULE_REPOSITORY,
        useClass: isPostgres ? PostgresDeliveryRuleRepository : JsonDeliveryRuleRepository,
      },
      {
        provide: ORDER_REPOSITORY,
        useClass: isPostgres ? PostgresOrderRepository : JsonOrderRepository,
      },
      {
        provide: REVIEW_REPOSITORY,
        useClass: isPostgres ? PostgresReviewRepository : JsonReviewRepository,
      },
      {
        provide: CONTACT_REPOSITORY,
        useClass: isPostgres ? PostgresContactRepository : JsonContactRepository,
      },
    ];

    return {
      module: RepositoryModule,
      providers,
      exports: providers,
    };
  }
}
