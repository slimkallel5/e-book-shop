import * as fs from 'fs';
import * as path from 'path';
import {
  JsonArticleRepository,
  JsonContactRepository,
  JsonDeliveryRuleRepository,
  JsonEducationLevelRepository,
  JsonOrderRepository,
  JsonPackRepository,
  JsonReviewRepository,
  JsonUserRepository,
} from '../src/repositories/json/json-repositories';
import {
  PostgresArticleRepository,
  PostgresContactRepository,
  PostgresDeliveryRuleRepository,
  PostgresEducationLevelRepository,
  PostgresOrderRepository,
  PostgresPackRepository,
  PostgresReviewRepository,
  PostgresUserRepository,
} from '../src/repositories/postgres/postgres-repositories';

describe('Repository Adapter Domain Parity Tests (JSON vs Postgres)', () => {
  const testDataDir = path.resolve(__dirname, 'tmp-parity-data');

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

  describe('EducationLevelRepository Parity', () => {
    it('should handle CRUD and localized fields identically across JSON and Postgres adapters', async () => {
      const jsonRepo = new JsonEducationLevelRepository();

      const createdJson = await jsonRepo.create({
        code: 'PRIM-1',
        name: { ar: 'السنة الأولى', fr: '1ère Année', en: '1st Grade' },
        category: 'primary',
        displayOrder: 1,
        active: true,
      });

      expect(createdJson.id).toBeDefined();
      expect(createdJson.name.ar).toBe('السنة الأولى');

      // Mock Prisma for Postgres Adapter Parity
      const mockPrisma: any = {
        educationLevel: {
          findMany: jest.fn().mockResolvedValue([
            {
              id: 'ed-1',
              code: 'PRIM-1',
              nameAr: 'السنة الأولى',
              nameFr: '1ère Année',
              nameEn: '1st Grade',
              category: 'primary',
              displayOrder: 1,
              active: true,
              createdAt: new Date('2025-01-01T00:00:00.000Z'),
              updatedAt: new Date('2025-01-01T00:00:00.000Z'),
            },
          ]),
          findUnique: jest.fn().mockImplementation(({ where }) => {
            if (where.id === 'ed-1') {
              return Promise.resolve({
                id: 'ed-1',
                code: 'PRIM-1',
                nameAr: 'السنة الأولى',
                nameFr: '1ère Année',
                nameEn: '1st Grade',
                category: 'primary',
                displayOrder: 1,
                active: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-01T00:00:00.000Z'),
              });
            }
            return Promise.resolve(null);
          }),
        },
      };

      const pgRepo = new PostgresEducationLevelRepository(mockPrisma);
      const pgItems = await pgRepo.findAll();
      const pgItem = await pgRepo.findById('ed-1');

      expect(pgItems.length).toBe(1);
      expect(pgItem?.name.ar).toBe(createdJson.name.ar);
      expect(pgItem?.category).toBe(createdJson.category);
    });
  });

  describe('ArticleRepository Parity', () => {
    it('should support search, price numerical casting, and filters identically', async () => {
      const jsonRepo = new JsonArticleRepository();

      const createdJson = await jsonRepo.create({
        sku: 'ART-PARITY-1',
        name: { ar: 'كتاب العلوم', fr: 'Livre des sciences' },
        price: 20.0,
        discountPrice: 15.0,
        stock: 30,
        educationLevelId: 'lvl-1',
        active: true,
      });

      const searchJson = await jsonRepo.findAll({ search: 'العلوم' });
      expect(searchJson.length).toBe(1);
      expect(searchJson[0].sku).toBe('ART-PARITY-1');

      // Mock Prisma for Postgres Adapter
      const mockPrisma: any = {
        article: {
          findMany: jest.fn().mockImplementation(({ where }) => {
            return Promise.resolve([
              {
                id: createdJson.id,
                sku: 'ART-PARITY-1',
                nameAr: 'كتاب العلوم',
                nameFr: 'Livre des sciences',
                price: '20.000',
                discountPrice: '15.000',
                stock: 30,
                educationLevelId: 'lvl-1',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]);
          }),
        },
      };

      const pgRepo = new PostgresArticleRepository(mockPrisma);
      const searchPg = await pgRepo.findAll({ search: 'العلوم' });

      expect(searchPg.length).toBe(1);
      expect(searchPg[0].price).toBe(20.0);
      expect(searchPg[0].discountPrice).toBe(15.0);
    });
  });

  describe('ReviewRepository Parity', () => {
    it('should respect publishedOnly filter correctly across both adapters', async () => {
      const jsonRepo = new JsonReviewRepository();

      const r1 = await jsonRepo.create({
        articleId: 'art-1',
        rating: 5,
        authorName: 'Khaled',
        comment: 'ممتاز',
        published: false,
      });

      const r2 = await jsonRepo.create({
        articleId: 'art-1',
        rating: 4,
        authorName: 'Ines',
        comment: 'جيد',
        published: true,
      });

      const publishedJson = await jsonRepo.findAll({ publishedOnly: true });
      expect(publishedJson.length).toBe(1);
      expect(publishedJson[0].id).toBe(r2.id);

      // Verify Postgres Review Repository uses published filter
      const mockPrisma: any = {
        review: {
          findMany: jest.fn().mockImplementation(({ where }) => {
            expect(where.published).toBe(true);
            return Promise.resolve([
              {
                id: 'rev-2',
                articleId: 'art-1',
                rating: 4,
                authorName: 'Ines',
                comment: 'جيد',
                published: true,
                createdAt: new Date(),
              },
            ]);
          }),
        },
      };

      const pgRepo = new PostgresReviewRepository(mockPrisma);
      const publishedPg = await pgRepo.findAll({ publishedOnly: true });
      expect(publishedPg.length).toBe(1);
      expect(publishedPg[0].published).toBe(true);
    });
  });

  describe('OrderRepository Parity', () => {
    it('should find order by reference case-insensitively in both adapters', async () => {
      const jsonRepo = new JsonOrderRepository();

      const orderJson = await jsonRepo.create({
        reference: 'TN-554433',
        customer: {
          fullName: 'Mohamed',
          email: 'm@example.tn',
          phone: '21699887766',
          city: 'Tunis',
          address: 'Bab Bhar',
        },
        items: [],
        subtotal: 40,
        deliveryFee: 7,
        total: 47,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'unpaid',
      });

      const foundJson = await jsonRepo.findByReference('tn-554433');
      expect(foundJson?.id).toBe(orderJson.id);

      // Mock Prisma for Postgres Order Repository
      const mockPrisma: any = {
        order: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'ord-pg-1',
            reference: 'TN-554433',
            customerFullName: 'Mohamed',
            customerEmail: 'm@example.tn',
            customerPhone: '21699887766',
            customerCity: 'Tunis',
            customerAddress: 'Bab Bhar',
            subtotal: '40.000',
            deliveryFee: '7.000',
            total: '47.000',
            status: 'pending',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'unpaid',
            items: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
          findUnique: jest.fn().mockResolvedValue({
            id: 'ord-pg-1',
            reference: 'TN-554433',
            customerFullName: 'Mohamed',
            customerEmail: 'm@example.tn',
            customerPhone: '21699887766',
            customerCity: 'Tunis',
            customerAddress: 'Bab Bhar',
            subtotal: '40.000',
            deliveryFee: '7.000',
            total: '47.000',
            status: 'pending',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'unpaid',
            items: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        },
      };

      const pgRepo = new PostgresOrderRepository(mockPrisma);
      const foundPg = await pgRepo.findByReference('tn-554433');
      expect(foundPg?.reference).toBe('TN-554433');
      expect(foundPg?.total).toBe(47);
    });
  });
});
