import { Injectable } from '@nestjs/common';
import {
  Article,
  ContactMessage,
  DeliveryRule,
  EducationLevel,
  Order,
  Pack,
  Review,
} from '../../common/interfaces/domain.interface';
import {
  IArticleRepository,
  IContactRepository,
  IDeliveryRuleRepository,
  IEducationLevelRepository,
  IOrderRepository,
  IPackRepository,
  IReviewRepository,
} from '../repository.interface';
import { PrismaService } from './prisma.service';

@Injectable()
export class PostgresEducationLevelRepository implements IEducationLevelRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<EducationLevel[]> {
    const items = await this.prisma.educationLevel.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return items.map((item: any) => ({
      id: item.id,
      code: item.code,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      category: item.category as any,
      displayOrder: item.displayOrder,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<EducationLevel | null> {
    const item = await this.prisma.educationLevel.findUnique({ where: { id } });
    if (!item) return null;
    return {
      id: item.id,
      code: item.code,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      category: item.category as any,
      displayOrder: item.displayOrder,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async create(data: Omit<EducationLevel, 'id' | 'createdAt' | 'updatedAt'>): Promise<EducationLevel> {
    const created = await this.prisma.educationLevel.create({
      data: {
        code: data.code,
        nameAr: data.name.ar,
        nameFr: data.name.fr,
        nameEn: data.name.en,
        category: data.category as any,
        displayOrder: data.displayOrder,
        active: data.active,
      },
    });
    return {
      id: created.id,
      code: created.code,
      name: { ar: created.nameAr, fr: created.nameFr || undefined, en: created.nameEn || undefined },
      category: created.category as any,
      displayOrder: created.displayOrder,
      active: created.active,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }
}

@Injectable()
export class PostgresArticleRepository implements IArticleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { educationLevelId?: string; activeOnly?: boolean; search?: string }): Promise<Article[]> {
    const where: any = {};
    if (filters?.activeOnly) where.active = true;
    if (filters?.educationLevelId) where.educationLevelId = filters.educationLevelId;
    if (filters?.search) {
      where.OR = [
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
        { nameFr: { contains: filters.search, mode: 'insensitive' } },
        { nameEn: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const items = await this.prisma.article.findMany({ where });
    return items.map((item: any) => ({
      id: item.id,
      sku: item.sku,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      description: item.descAr
        ? { ar: item.descAr, fr: item.descFr || undefined, en: item.descEn || undefined }
        : undefined,
      price: Number(item.price),
      discountPrice: item.discountPrice ? Number(item.discountPrice) : undefined,
      stock: item.stock !== null ? item.stock : undefined,
      educationLevelId: item.educationLevelId,
      quarter: item.quarter ? (item.quarter as any) : undefined,
      posterUrl: item.posterUrl || undefined,
      samplePdfUrl: item.samplePdfUrl || undefined,
      author: item.author || undefined,
      publisher: item.publisher || undefined,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<Article | null> {
    const item = await this.prisma.article.findUnique({ where: { id } });
    if (!item) return null;
    return {
      id: item.id,
      sku: item.sku,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      description: item.descAr
        ? { ar: item.descAr, fr: item.descFr || undefined, en: item.descEn || undefined }
        : undefined,
      price: Number(item.price),
      discountPrice: item.discountPrice ? Number(item.discountPrice) : undefined,
      stock: item.stock !== null ? item.stock : undefined,
      educationLevelId: item.educationLevelId,
      quarter: item.quarter ? (item.quarter as any) : undefined,
      posterUrl: item.posterUrl || undefined,
      samplePdfUrl: item.samplePdfUrl || undefined,
      author: item.author || undefined,
      publisher: item.publisher || undefined,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async create(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    const created = await this.prisma.article.create({
      data: {
        sku: data.sku,
        nameAr: data.name.ar,
        nameFr: data.name.fr,
        nameEn: data.name.en,
        descAr: data.description?.ar,
        descFr: data.description?.fr,
        descEn: data.description?.en,
        price: data.price,
        discountPrice: data.discountPrice,
        stock: data.stock,
        educationLevelId: data.educationLevelId,
        quarter: data.quarter as any,
        posterUrl: data.posterUrl,
        samplePdfUrl: data.samplePdfUrl,
        author: data.author,
        publisher: data.publisher,
        active: data.active,
      },
    });
    return this.findById(created.id) as Promise<Article>;
  }

  async update(id: string, data: Partial<Article>): Promise<Article | null> {
    const updateData: any = {};
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.name) {
      if (data.name.ar) updateData.nameAr = data.name.ar;
      if (data.name.fr !== undefined) updateData.nameFr = data.name.fr;
      if (data.name.en !== undefined) updateData.nameEn = data.name.en;
    }
    if (data.description) {
      if (data.description.ar !== undefined) updateData.descAr = data.description.ar;
      if (data.description.fr !== undefined) updateData.descFr = data.description.fr;
      if (data.description.en !== undefined) updateData.descEn = data.description.en;
    }
    if (data.price !== undefined) updateData.price = data.price;
    if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.educationLevelId !== undefined) updateData.educationLevelId = data.educationLevelId;
    if (data.quarter !== undefined) updateData.quarter = data.quarter;
    if (data.posterUrl !== undefined) updateData.posterUrl = data.posterUrl;
    if (data.samplePdfUrl !== undefined) updateData.samplePdfUrl = data.samplePdfUrl;
    if (data.active !== undefined) updateData.active = data.active;

    await this.prisma.article.update({ where: { id }, data: updateData });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.article.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

@Injectable()
export class PostgresPackRepository implements IPackRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { activeOnly?: boolean; search?: string }): Promise<Pack[]> {
    const where: any = {};
    if (filters?.activeOnly) where.active = true;
    if (filters?.search) {
      where.OR = [
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
        { nameFr: { contains: filters.search, mode: 'insensitive' } },
        { nameEn: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const items = await this.prisma.pack.findMany({ where, include: { items: true } });
    return items.map((item: any) => ({
      id: item.id,
      sku: item.sku,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      description: item.descAr
        ? { ar: item.descAr, fr: item.descFr || undefined, en: item.descEn || undefined }
        : undefined,
      price: Number(item.price),
      discountPrice: item.discountPrice ? Number(item.discountPrice) : undefined,
      items: item.items.map((i: any) => ({ articleId: i.articleId, quantity: i.quantity })),
      posterUrl: item.posterUrl || undefined,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<Pack | null> {
    const item = await this.prisma.pack.findUnique({ where: { id }, include: { items: true } });
    if (!item) return null;
    return {
      id: item.id,
      sku: item.sku,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      description: item.descAr
        ? { ar: item.descAr, fr: item.descFr || undefined, en: item.descEn || undefined }
        : undefined,
      price: Number(item.price),
      discountPrice: item.discountPrice ? Number(item.discountPrice) : undefined,
      items: item.items.map((i: any) => ({ articleId: i.articleId, quantity: i.quantity })),
      posterUrl: item.posterUrl || undefined,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async create(data: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pack> {
    const created = await this.prisma.pack.create({
      data: {
        sku: data.sku,
        nameAr: data.name.ar,
        nameFr: data.name.fr,
        nameEn: data.name.en,
        descAr: data.description?.ar,
        descFr: data.description?.fr,
        descEn: data.description?.en,
        price: data.price,
        discountPrice: data.discountPrice,
        posterUrl: data.posterUrl,
        active: data.active,
        items: {
          create: data.items.map((i) => ({ articleId: i.articleId, quantity: i.quantity })),
        },
      },
    });
    return this.findById(created.id) as Promise<Pack>;
  }

  async update(id: string, data: Partial<Pack>): Promise<Pack | null> {
    const updateData: any = {};
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.name) {
      if (data.name.ar) updateData.nameAr = data.name.ar;
      if (data.name.fr !== undefined) updateData.nameFr = data.name.fr;
      if (data.name.en !== undefined) updateData.nameEn = data.name.en;
    }
    if (data.description) {
      if (data.description.ar !== undefined) updateData.descAr = data.description.ar;
      if (data.description.fr !== undefined) updateData.descFr = data.description.fr;
      if (data.description.en !== undefined) updateData.descEn = data.description.en;
    }
    if (data.price !== undefined) updateData.price = data.price;
    if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice;
    if (data.posterUrl !== undefined) updateData.posterUrl = data.posterUrl;
    if (data.active !== undefined) updateData.active = data.active;

    if (data.items) {
      await this.prisma.packItem.deleteMany({ where: { packId: id } });
      updateData.items = {
        create: data.items.map((i) => ({ articleId: i.articleId, quantity: i.quantity })),
      };
    }

    await this.prisma.pack.update({ where: { id }, data: updateData });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.pack.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

@Injectable()
export class PostgresDeliveryRuleRepository implements IDeliveryRuleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly?: boolean): Promise<DeliveryRule[]> {
    const where: any = {};
    if (activeOnly) where.active = true;
    const items = await this.prisma.deliveryRule.findMany({ where, orderBy: { priority: 'asc' } });
    return items.map((item: any) => ({
      id: item.id,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      minSubtotal: Number(item.minSubtotal),
      maxSubtotal: item.maxSubtotal ? Number(item.maxSubtotal) : undefined,
      fee: Number(item.fee),
      isFree: item.isFree,
      active: item.active,
      priority: item.priority,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<DeliveryRule | null> {
    const item = await this.prisma.deliveryRule.findUnique({ where: { id } });
    if (!item) return null;
    return {
      id: item.id,
      name: { ar: item.nameAr, fr: item.nameFr || undefined, en: item.nameEn || undefined },
      minSubtotal: Number(item.minSubtotal),
      maxSubtotal: item.maxSubtotal ? Number(item.maxSubtotal) : undefined,
      fee: Number(item.fee),
      isFree: item.isFree,
      active: item.active,
      priority: item.priority,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async create(data: Omit<DeliveryRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryRule> {
    const created = await this.prisma.deliveryRule.create({
      data: {
        nameAr: data.name.ar,
        nameFr: data.name.fr,
        nameEn: data.name.en,
        minSubtotal: data.minSubtotal,
        maxSubtotal: data.maxSubtotal,
        fee: data.fee,
        isFree: data.isFree,
        active: data.active,
        priority: data.priority,
      },
    });
    return this.findById(created.id) as Promise<DeliveryRule>;
  }

  async update(id: string, data: Partial<DeliveryRule>): Promise<DeliveryRule | null> {
    const updateData: any = {};
    if (data.name) {
      if (data.name.ar) updateData.nameAr = data.name.ar;
      if (data.name.fr !== undefined) updateData.nameFr = data.name.fr;
      if (data.name.en !== undefined) updateData.nameEn = data.name.en;
    }
    if (data.minSubtotal !== undefined) updateData.minSubtotal = data.minSubtotal;
    if (data.maxSubtotal !== undefined) updateData.maxSubtotal = data.maxSubtotal;
    if (data.fee !== undefined) updateData.fee = data.fee;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.priority !== undefined) updateData.priority = data.priority;

    await this.prisma.deliveryRule.update({ where: { id }, data: updateData });
    return this.findById(id);
  }
}

@Injectable()
export class PostgresOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { status?: string; search?: string }): Promise<Order[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { reference: { contains: filters.search, mode: 'insensitive' } },
        { customerFullName: { contains: filters.search, mode: 'insensitive' } },
        { customerPhone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const items = await this.prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item: any) => ({
      id: item.id,
      reference: item.reference,
      customer: {
        fullName: item.customerFullName,
        email: item.customerEmail,
        phone: item.customerPhone,
        city: item.customerCity,
        address: item.customerAddress,
        instructions: item.customerInstructions || undefined,
      },
      items: item.items.map((i: any) => ({
        type: i.type as any,
        itemId: i.itemId,
        name: { ar: i.nameAr, fr: i.nameFr || undefined, en: i.nameEn || undefined },
        unitPrice: Number(i.unitPrice),
        discountPrice: i.discountPrice ? Number(i.discountPrice) : undefined,
        quantity: i.quantity,
        subtotal: Number(i.subtotal),
      })),
      subtotal: Number(item.subtotal),
      deliveryFee: Number(item.deliveryFee),
      appliedDeliveryRuleId: item.appliedDeliveryRuleId || undefined,
      total: Number(item.total),
      status: item.status as any,
      rejectionReason: item.rejectionReason || undefined,
      paymentMethod: item.paymentMethod as any,
      paymentStatus: item.paymentStatus as any,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findById(id: string): Promise<Order | null> {
    const item = await this.prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!item) return null;
    return {
      id: item.id,
      reference: item.reference,
      customer: {
        fullName: item.customerFullName,
        email: item.customerEmail,
        phone: item.customerPhone,
        city: item.customerCity,
        address: item.customerAddress,
        instructions: item.customerInstructions || undefined,
      },
      items: item.items.map((i: any) => ({
        type: i.type as any,
        itemId: i.itemId,
        name: { ar: i.nameAr, fr: i.nameFr || undefined, en: i.nameEn || undefined },
        unitPrice: Number(i.unitPrice),
        discountPrice: i.discountPrice ? Number(i.discountPrice) : undefined,
        quantity: i.quantity,
        subtotal: Number(i.subtotal),
      })),
      subtotal: Number(item.subtotal),
      deliveryFee: Number(item.deliveryFee),
      appliedDeliveryRuleId: item.appliedDeliveryRuleId || undefined,
      total: Number(item.total),
      status: item.status as any,
      rejectionReason: item.rejectionReason || undefined,
      paymentMethod: item.paymentMethod as any,
      paymentStatus: item.paymentStatus as any,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  async findByReference(reference: string): Promise<Order | null> {
    const item = await this.prisma.order.findFirst({
      where: { reference: { equals: reference, mode: 'insensitive' } },
      include: { items: true },
    });
    if (!item) return null;
    return this.findById(item.id);
  }

  async create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const created = await this.prisma.order.create({
      data: {
        reference: data.reference,
        customerFullName: data.customer.fullName,
        customerEmail: data.customer.email,
        customerPhone: data.customer.phone,
        customerCity: data.customer.city,
        customerAddress: data.customer.address,
        customerInstructions: data.customer.instructions,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        appliedDeliveryRuleId: data.appliedDeliveryRuleId,
        total: data.total,
        status: data.status as any,
        paymentMethod: data.paymentMethod as any,
        paymentStatus: data.paymentStatus as any,
        items: {
          create: data.items.map((i) => ({
            type: i.type,
            itemId: i.itemId,
            nameAr: i.name.ar,
            nameFr: i.name.fr,
            nameEn: i.name.en,
            unitPrice: i.unitPrice,
            discountPrice: i.discountPrice,
            quantity: i.quantity,
            subtotal: i.subtotal,
          })),
        },
      },
    });
    return this.findById(created.id) as Promise<Order>;
  }

  async updateStatus(id: string, status: Order['status'], rejectionReason?: string): Promise<Order | null> {
    await this.prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      },
    });
    return this.findById(id);
  }
}

@Injectable()
export class PostgresReviewRepository implements IReviewRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { articleId?: string; publishedOnly?: boolean }): Promise<Review[]> {
    const where: any = {};
    if (filters?.publishedOnly) where.active = true;
    if (filters?.articleId !== undefined) where.articleId = filters.articleId;

    const items = await this.prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } });
    return items.map((item: any) => ({
      id: item.id,
      articleId: item.articleId || undefined,
      rating: item.rating,
      authorName: item.authorName,
      comment: item.comment,
      published: item.published,
      createdAt: item.createdAt.toISOString(),
    }));
  }

  async create(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const created = await this.prisma.review.create({
      data: {
        articleId: data.articleId,
        rating: data.rating,
        authorName: data.authorName,
        comment: data.comment,
        published: data.published,
      },
    });
    return {
      id: created.id,
      articleId: created.articleId || undefined,
      rating: created.rating,
      authorName: created.authorName,
      comment: created.comment,
      published: created.published,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async updatePublished(id: string, published: boolean): Promise<Review | null> {
    const updated = await this.prisma.review.update({ where: { id }, data: { published } });
    return {
      id: updated.id,
      articleId: updated.articleId || undefined,
      rating: updated.rating,
      authorName: updated.authorName,
      comment: updated.comment,
      published: updated.published,
      createdAt: updated.createdAt.toISOString(),
    };
  }
}

@Injectable()
export class PostgresContactRepository implements IContactRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ContactMessage[]> {
    const items = await this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone || undefined,
      subject: item.subject,
      message: item.message,
      read: item.read,
      createdAt: item.createdAt.toISOString(),
    }));
  }

  async create(data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    const created = await this.prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });
    return {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone || undefined,
      subject: created.subject,
      message: created.message,
      read: created.read,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async markAsRead(id: string): Promise<ContactMessage | null> {
    const updated = await this.prisma.contactMessage.update({ where: { id }, data: { read: true } });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone || undefined,
      subject: updated.subject,
      message: updated.message,
      read: updated.read,
      createdAt: updated.createdAt.toISOString(),
    };
  }
}
