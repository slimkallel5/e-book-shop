import { BadRequestException } from '@nestjs/common';
import { ArticlesController, PacksController } from '../src/controllers/catalog.controller';
import { JsonArticleRepository, JsonEducationLevelRepository, JsonPackRepository } from '../src/repositories/json/json-repositories';
import * as fs from 'fs';
import * as path from 'path';

describe('Catalog Admin Business Rules & Validation Tests', () => {
  const testDataDir = path.resolve(__dirname, 'tmp-catalog-data');

  beforeAll(() => {
    process.env.DATA_DIR = testDataDir;
  });

  beforeEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    delete process.env.DATA_DIR;
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it('should reject article creation with negative price or discount price >= base price', async () => {
    const artRepo = new JsonArticleRepository();
    const articlesController = new ArticlesController(artRepo);

    // Negative price
    await expect(
      articlesController.create({
        sku: 'NEG-1',
        name: { ar: 'كتاب' },
        price: -10,
        educationLevelId: 'level-1',
      }),
    ).rejects.toThrow(BadRequestException);

    // Discount price >= base price
    await expect(
      articlesController.create({
        sku: 'DISC-1',
        name: { ar: 'كتاب' },
        price: 20,
        discountPrice: 25,
        educationLevelId: 'level-1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should successfully create, update, and delete an article with valid fields', async () => {
    const artRepo = new JsonArticleRepository();
    const edRepo = new JsonEducationLevelRepository();
    const articlesController = new ArticlesController(artRepo);

    const level = await edRepo.create({
      code: 'PRIM',
      name: { ar: 'ابتدائي' },
      category: 'primary',
      displayOrder: 1,
      active: true,
    });

    const article = await articlesController.create({
      sku: 'ART-001',
      name: { ar: 'كتاب القراءة', fr: 'Livre de lecture', en: 'Reading Book' },
      description: { ar: 'وصف الكتاب' },
      price: 15.5,
      discountPrice: 12.0,
      educationLevelId: level.id,
      educationSubLevel: '3',
      quarter: 'Q1',
      active: true,
    });

    expect(article.id).toBeDefined();
    expect(article.price).toBe(15.5);
    expect(article.discountPrice).toBe(12.0);
    expect(article.educationSubLevel).toBe('3');

    const updated = await articlesController.update(article.id, {
      price: 18.0,
      discountPrice: 14.0,
      educationSubLevel: '4',
    });

    expect(updated?.price).toBe(18.0);
    expect(updated?.discountPrice).toBe(14.0);
    expect(updated?.educationSubLevel).toBe('4');

    const deleteRes = await articlesController.delete(article.id);
    expect(deleteRes.success).toBe(true);
  });

  it('should reject pack creation with duplicate article items or invalid discount price', async () => {
    const packRepo = new JsonPackRepository();
    const packsController = new PacksController(packRepo);

    // Duplicate article IDs
    await expect(
      packsController.create({
        sku: 'PACK-DUP',
        name: { ar: 'حزمة مكررة' },
        price: 50,
        items: [
          { articleId: 'art-1', quantity: 1 },
          { articleId: 'art-1', quantity: 2 },
        ],
      }),
    ).rejects.toThrow(BadRequestException);

    // Discount price >= price
    await expect(
      packsController.create({
        sku: 'PACK-INV-DISC',
        name: { ar: 'حزمة' },
        price: 50,
        discountPrice: 55,
        items: [{ articleId: 'art-1', quantity: 1 }],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should successfully create, update and retrieve packs', async () => {
    const packRepo = new JsonPackRepository();
    const packsController = new PacksController(packRepo);

    const pack = await packsController.create({
      sku: 'PACK-001',
      name: { ar: 'حزمة العودة للمدرسة', fr: 'Pack Rentrée' },
      price: 45.0,
      discountPrice: 38.0,
      items: [
        { articleId: 'art-1', quantity: 1 },
        { articleId: 'art-2', quantity: 1 },
      ],
      active: true,
    });

    expect(pack.id).toBeDefined();
    expect(pack.items.length).toBe(2);

    const fetched = await packsController.getById(pack.id);
    expect(fetched.sku).toBe('PACK-001');

    const updated = await packsController.update(pack.id, {
      price: 40.0,
      discountPrice: 35.0,
    });

    expect(updated?.price).toBe(40.0);
  });
});
