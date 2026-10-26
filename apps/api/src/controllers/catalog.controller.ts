import { BadRequestException, Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateArticleDto, CreatePackDto } from '../common/dto/domain.dto';
import {
  ARTICLE_REPOSITORY,
  EDUCATION_LEVEL_REPOSITORY,
  PACK_REPOSITORY,
} from '../repositories/repository.module';
import {
  IArticleRepository,
  IEducationLevelRepository,
  IPackRepository,
} from '../repositories/repository.interface';

@ApiTags('Education Levels')
@Controller('education-levels')
export class EducationLevelsController {
  constructor(
    @Inject(EDUCATION_LEVEL_REPOSITORY)
    private educationLevelRepo: IEducationLevelRepository,
  ) {}

  @Get()
  async getAll() {
    return this.educationLevelRepo.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const item = await this.educationLevelRepo.findById(id);
    if (!item) throw new NotFoundException('Education level not found');
    return item;
  }
}

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private articleRepo: IArticleRepository,
  ) {}

  @Get()
  async getAll(
    @Query('educationLevelId') educationLevelId?: string,
    @Query('activeOnly') activeOnly?: string,
    @Query('search') search?: string,
  ) {
    return this.articleRepo.findAll({
      educationLevelId,
      activeOnly: activeOnly === 'true',
      search,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const item = await this.articleRepo.findById(id);
    if (!item) throw new NotFoundException('Article not found');
    return item;
  }

  @Post()
  async create(@Body() dto: CreateArticleDto) {
    if (dto.price < 0) {
      throw new BadRequestException('Base price cannot be negative');
    }
    if (dto.discountPrice !== undefined && dto.discountPrice !== null) {
      if (dto.discountPrice < 0) {
        throw new BadRequestException('Discount price cannot be negative');
      }
      if (dto.discountPrice >= dto.price) {
        throw new BadRequestException('Discount price must be less than base price');
      }
    }

    return this.articleRepo.create({
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      discountPrice: dto.discountPrice,
      stock: dto.stock,
      educationLevelId: dto.educationLevelId,
      quarter: dto.quarter,
      posterUrl: dto.posterUrl,
      samplePdfUrl: dto.samplePdfUrl,
      author: dto.author,
      publisher: dto.publisher,
      active: dto.active ?? true,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateArticleDto>) {
    const existing = await this.articleRepo.findById(id);
    if (!existing) throw new NotFoundException('Article not found');

    const effectivePrice = dto.price !== undefined ? dto.price : existing.price;
    const effectiveDiscount = dto.discountPrice !== undefined ? dto.discountPrice : existing.discountPrice;

    if (effectivePrice < 0) {
      throw new BadRequestException('Base price cannot be negative');
    }
    if (effectiveDiscount !== undefined && effectiveDiscount !== null) {
      if (effectiveDiscount < 0) {
        throw new BadRequestException('Discount price cannot be negative');
      }
      if (effectiveDiscount >= effectivePrice) {
        throw new BadRequestException('Discount price must be less than base price');
      }
    }

    const updated = await this.articleRepo.update(id, dto);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.articleRepo.delete(id);
    if (!success) throw new NotFoundException('Article not found');
    return { success: true };
  }
}

@ApiTags('Packs')
@Controller('packs')
export class PacksController {
  constructor(
    @Inject(PACK_REPOSITORY)
    private packRepo: IPackRepository,
  ) {}

  @Get()
  async getAll(
    @Query('activeOnly') activeOnly?: string,
    @Query('search') search?: string,
  ) {
    return this.packRepo.findAll({
      activeOnly: activeOnly === 'true',
      search,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const item = await this.packRepo.findById(id);
    if (!item) throw new NotFoundException('Pack not found');
    return item;
  }

  @Post()
  async create(@Body() dto: CreatePackDto) {
    if (dto.price < 0) {
      throw new BadRequestException('Pack price cannot be negative');
    }
    if (dto.discountPrice !== undefined && dto.discountPrice !== null) {
      if (dto.discountPrice < 0) {
        throw new BadRequestException('Discount price cannot be negative');
      }
      if (dto.discountPrice >= dto.price) {
        throw new BadRequestException('Discount price must be less than base price');
      }
    }
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Pack must contain at least one item');
    }

    const articleIds = dto.items.map((i) => i.articleId);
    if (new Set(articleIds).size !== articleIds.length) {
      throw new BadRequestException('Pack items cannot contain duplicate articles');
    }

    return this.packRepo.create({
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      discountPrice: dto.discountPrice,
      items: dto.items,
      posterUrl: dto.posterUrl,
      active: dto.active ?? true,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreatePackDto>) {
    const existing = await this.packRepo.findById(id);
    if (!existing) throw new NotFoundException('Pack not found');

    const effectivePrice = dto.price !== undefined ? dto.price : existing.price;
    const effectiveDiscount = dto.discountPrice !== undefined ? dto.discountPrice : existing.discountPrice;

    if (effectivePrice < 0) {
      throw new BadRequestException('Pack price cannot be negative');
    }
    if (effectiveDiscount !== undefined && effectiveDiscount !== null) {
      if (effectiveDiscount < 0) {
        throw new BadRequestException('Discount price cannot be negative');
      }
      if (effectiveDiscount >= effectivePrice) {
        throw new BadRequestException('Discount price must be less than base price');
      }
    }

    if (dto.items) {
      if (dto.items.length === 0) {
        throw new BadRequestException('Pack must contain at least one item');
      }
      const articleIds = dto.items.map((i) => i.articleId);
      if (new Set(articleIds).size !== articleIds.length) {
        throw new BadRequestException('Pack items cannot contain duplicate articles');
      }
    }

    const updated = await this.packRepo.update(id, dto);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.packRepo.delete(id);
    if (!success) throw new NotFoundException('Pack not found');
    return { success: true };
  }
}
