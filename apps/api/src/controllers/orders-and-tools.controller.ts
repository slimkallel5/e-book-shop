import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import {
  CreateContactMessageDto,
  CreateOrderDto,
  CreateReviewDto,
  UpdateOrderStatusDto,
} from '../common/dto/domain.dto';
import {
  ARTICLE_REPOSITORY,
  CONTACT_REPOSITORY,
  DELIVERY_RULE_REPOSITORY,
  ORDER_REPOSITORY,
  PACK_REPOSITORY,
  REVIEW_REPOSITORY,
} from '../repositories/repository.module';
import {
  IArticleRepository,
  IContactRepository,
  IDeliveryRuleRepository,
  IOrderRepository,
  IPackRepository,
  IReviewRepository,
} from '../repositories/repository.interface';

@ApiTags('Delivery Rules')
@Controller('delivery-rules')
export class DeliveryRulesController {
  constructor(
    @Inject(DELIVERY_RULE_REPOSITORY)
    private deliveryRuleRepo: IDeliveryRuleRepository,
  ) {}

  @Get()
  async getAll(@Query('activeOnly') activeOnly?: string) {
    return this.deliveryRuleRepo.findAll(activeOnly === 'true');
  }
}

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_REPOSITORY) private orderRepo: IOrderRepository,
    @Inject(ARTICLE_REPOSITORY) private articleRepo: IArticleRepository,
    @Inject(PACK_REPOSITORY) private packRepo: IPackRepository,
    @Inject(DELIVERY_RULE_REPOSITORY) private deliveryRuleRepo: IDeliveryRuleRepository,
  ) {}

  @Get()
  async getAll(@Query('status') status?: string, @Query('search') search?: string) {
    return this.orderRepo.findAll({ status, search });
  }

  @Get('lookup/:reference')
  async getByReference(@Param('reference') reference: string) {
    const order = await this.orderRepo.findByReference(reference);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let subtotal = 0;
    const itemSnapshots = [];

    for (const itemDto of dto.items) {
      if (itemDto.type === 'article') {
        const article = await this.articleRepo.findById(itemDto.itemId);
        if (!article || !article.active) {
          throw new BadRequestException(`Article ID ${itemDto.itemId} is unavailable`);
        }
        const unitPrice = article.price;
        const discountPrice = article.discountPrice;
        const effectivePrice = discountPrice !== undefined ? discountPrice : unitPrice;
        const lineSubtotal = effectivePrice * itemDto.quantity;
        subtotal += lineSubtotal;

        itemSnapshots.push({
          type: 'article' as const,
          itemId: article.id,
          name: article.name,
          unitPrice,
          discountPrice,
          quantity: itemDto.quantity,
          subtotal: lineSubtotal,
        });
      } else if (itemDto.type === 'pack') {
        const pack = await this.packRepo.findById(itemDto.itemId);
        if (!pack || !pack.active) {
          throw new BadRequestException(`Pack ID ${itemDto.itemId} is unavailable`);
        }
        const unitPrice = pack.price;
        const discountPrice = pack.discountPrice;
        const effectivePrice = discountPrice !== undefined ? discountPrice : unitPrice;
        const lineSubtotal = effectivePrice * itemDto.quantity;
        subtotal += lineSubtotal;

        itemSnapshots.push({
          type: 'pack' as const,
          itemId: pack.id,
          name: pack.name,
          unitPrice,
          discountPrice,
          quantity: itemDto.quantity,
          subtotal: lineSubtotal,
        });
      }
    }

    // Delivery Rule Calculation
    const deliveryRules = await this.deliveryRuleRepo.findAll(true);
    let deliveryFee = 7.0; // Default delivery fee in TND
    let appliedRuleId: string | undefined;

    for (const rule of deliveryRules) {
      if (
        subtotal >= rule.minSubtotal &&
        (rule.maxSubtotal === undefined || rule.maxSubtotal === null || subtotal <= rule.maxSubtotal)
      ) {
        deliveryFee = rule.isFree ? 0 : rule.fee;
        appliedRuleId = rule.id;
        break;
      }
    }

    const total = subtotal + deliveryFee;
    const reference = `TN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    return this.orderRepo.create({
      reference,
      customer: dto.customer,
      items: itemSnapshots,
      subtotal,
      deliveryFee,
      appliedDeliveryRuleId: appliedRuleId,
      total,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid',
    });
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    if (dto.status === 'rejected' && !dto.rejectionReason) {
      throw new BadRequestException('A rejection reason is required when rejecting an order');
    }
    const updated = await this.orderRepo.updateStatus(id, dto.status, dto.rejectionReason);
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }
}

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    @Inject(REVIEW_REPOSITORY) private reviewRepo: IReviewRepository,
  ) {}

  @Get()
  async getAll(
    @Query('articleId') articleId?: string,
    @Query('publishedOnly') publishedOnly?: string,
  ) {
    return this.reviewRepo.findAll({
      articleId,
      publishedOnly: publishedOnly === 'true',
    });
  }

  @Post()
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewRepo.create({
      articleId: dto.articleId,
      rating: dto.rating,
      authorName: dto.authorName,
      comment: dto.comment,
      published: false, // Default to moderation queue
    });
  }

  @Put(':id/publish')
  async setPublished(@Param('id') id: string, @Body('published') published: boolean) {
    const updated = await this.reviewRepo.updatePublished(id, published);
    if (!updated) throw new NotFoundException('Review not found');
    return updated;
  }
}

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(
    @Inject(CONTACT_REPOSITORY) private contactRepo: IContactRepository,
  ) {}

  @Get()
  async getAll() {
    return this.contactRepo.findAll();
  }

  @Post()
  async create(@Body() dto: CreateContactMessageDto) {
    return this.contactRepo.create(dto);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    const updated = await this.contactRepo.markAsRead(id);
    if (!updated) throw new NotFoundException('Contact message not found');
    return updated;
  }
}

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = path.resolve(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
      fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/pdf',
        ];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Unsupported file type. Only JPEG, PNG, WEBP images and PDF files are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('File is required or file format is unsupported');
    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`,
    };
  }
}
