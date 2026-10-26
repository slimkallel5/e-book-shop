import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesController, EducationLevelsController, PacksController } from './controllers/catalog.controller';
import {
  ContactController,
  DeliveryRulesController,
  OrdersController,
  ReviewsController,
  UploadsController,
} from './controllers/orders-and-tools.controller';
import { RepositoryModule } from './repositories/repository.module';

@Module({
  imports: [
    RepositoryModule.register(),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { fallthrough: true },
    }),
  ],
  controllers: [
    AppController,
    EducationLevelsController,
    ArticlesController,
    PacksController,
    DeliveryRulesController,
    OrdersController,
    ReviewsController,
    ContactController,
    UploadsController,
  ],
  providers: [AppService],
})
export class AppModule {}
