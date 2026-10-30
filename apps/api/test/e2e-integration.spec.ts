import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { JWT_SECRET } from '../src/auth/auth.guard';
import { AuthService } from '../src/auth/auth.service';
import { RolesGuard } from '../src/auth/roles.guard';
import { AdminDashboardController } from '../src/controllers/admin-dashboard.controller';
import { ArticlesController, EducationLevelsController, PacksController } from '../src/controllers/catalog.controller';
import { ContactController, OrdersController, ReviewsController } from '../src/controllers/orders-and-tools.controller';
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

describe('End-to-End User Journey & Security Integration Tests', () => {
  const testDataDir = path.resolve(__dirname, 'tmp-e2e-data');

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

  it('should execute complete user journey from catalog browsing to checkout and admin fulfillment', async () => {
    // Repositories initialization
    const edRepo = new JsonEducationLevelRepository();
    const artRepo = new JsonArticleRepository();
    const packRepo = new JsonPackRepository();
    const deliveryRepo = new JsonDeliveryRuleRepository();
    const orderRepo = new JsonOrderRepository();
    const reviewRepo = new JsonReviewRepository();
    const contactRepo = new JsonContactRepository();
    const userRepo = new JsonUserRepository();

    // Controllers initialization
    const edController = new EducationLevelsController(edRepo);
    const artController = new ArticlesController(artRepo);
    const packController = new PacksController(packRepo);
    const ordersController = new OrdersController(orderRepo, artRepo, packRepo, deliveryRepo);
    const reviewsController = new ReviewsController(reviewRepo);
    const contactController = new ContactController(contactRepo);
    const dashboardController = new AdminDashboardController(artRepo, packRepo, orderRepo, reviewRepo);

    // Setup Auth Service
    const jwtService = new JwtService({ secret: JWT_SECRET });
    const authService = new AuthService(userRepo, jwtService);

    // 1. Setup Education Levels
    const level1 = await edRepo.create({
      code: 'PRIM-6',
      name: { ar: 'السنة السادسة ابتدائي', fr: '6ème Année Primaire', en: '6th Primary Grade' },
      category: 'primary',
      displayOrder: 1,
      active: true,
    });
    expect(level1.id).toBeDefined();

    const levels = await edController.getAll();
    expect(levels.length).toBe(1);

    // 2. Add Articles
    const article1 = await artController.create({
      sku: 'MATH-6-TN',
      name: { ar: 'كتاب الرياضيات - 6 ابتدائي', fr: 'Manuel de Mathématiques - 6ème', en: 'Math Workbook - Grade 6' },
      description: { ar: 'تمارين ومسائل محلولة في الرياضيات' },
      price: 22.5,
      discountPrice: 18.0,
      stock: 50,
      educationLevelId: level1.id,
      quarter: 'ALL_YEAR',
      active: true,
    });

    const article2 = await artController.create({
      sku: 'ARABIC-6-TN',
      name: { ar: 'كتاب اللغة العربية - 6 ابتدائي', fr: 'Livre d Arabe - 6ème' },
      price: 15.0,
      stock: 5, // Low stock item
      educationLevelId: level1.id,
      quarter: 'Q1',
      active: true,
    });

    // Search catalog
    const searchResult = await artController.getAll(level1.id, undefined, 'الرياضيات');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].sku).toBe('MATH-6-TN');

    // Fetch Article by ID
    const singleArticle = await artController.getById(article1.id);
    expect(singleArticle.price).toBe(22.5);
    expect(singleArticle.discountPrice).toBe(18.0);

    // 3. Create Book Pack
    const pack = await packController.create({
      sku: 'PACK-GRADE6-ESSENTIAL',
      name: { ar: 'حزمة السادسة ابتدائي الأساسية' },
      price: 37.5,
      discountPrice: 30.0,
      items: [
        { articleId: article1.id, quantity: 1 },
        { articleId: article2.id, quantity: 1 },
      ],
      active: true,
    });
    expect(pack.id).toBeDefined();
    expect(pack.items.length).toBe(2);

    // Setup delivery rule
    await deliveryRepo.create({
      name: { ar: 'توصيل قياسي', fr: 'Livraison standard' },
      minSubtotal: 0,
      maxSubtotal: 50,
      fee: 7.0,
      isFree: false,
      active: true,
      priority: 1,
    });

    // 4. Guest Checkout (placing order)
    const order = await ordersController.createOrder({
      customer: {
        fullName: 'Bilel Ben Salem',
        email: 'bilel@example.tn',
        phone: '21698765432',
        city: 'Ariana',
        address: 'Cite Ennasr 2',
        instructions: 'Call upon arrival',
      },
      items: [
        { type: 'article', itemId: article1.id, quantity: 2 }, // 2 * 18.0 = 36.0
        { type: 'pack', itemId: pack.id, quantity: 1 }, // 1 * 30.0 = 30.0
      ],
      recaptchaToken: 'valid-test-token',
    });

    expect(order.id).toBeDefined();
    expect(order.reference).toMatch(/^TN-/);
    expect(order.subtotal).toBe(66.0); // 36.0 + 30.0
    expect(order.status).toBe('pending');

    // 5. Guest Lookup Order by Reference
    const guestOrderLookup = await ordersController.getByReference(order.reference);
    expect(guestOrderLookup.id).toBe(order.id);
    expect(guestOrderLookup.customer.fullName).toBe('Bilel Ben Salem');

    // 6. Submit Review & Contact Message
    const review = await reviewsController.create({
      articleId: article1.id,
      rating: 5,
      authorName: 'Bilel',
      comment: 'ممتاز جداً والتوصيل سريع',
    });
    expect(review.published).toBe(false);

    const contactMsg = await contactController.create({
      name: 'Salma',
      email: 'salma@example.tn',
      phone: '21622113344',
      subject: 'استفسار عن حزم الإعدادي',
      message: 'متى تتوفر حزم السنة التاسعة أساسي؟',
    });
    expect(contactMsg.read).toBe(false);

    // 7. Admin Authentication & Management
    const adminPasswordHash = await bcrypt.hash('adminPass123', 10);
    await userRepo.create({
      email: 'admin@ebookshop.tn',
      passwordHash: adminPasswordHash,
      fullName: 'Chief Admin',
      role: 'admin',
    });

    const loginRes = await authService.login({
      email: 'admin@ebookshop.tn',
      password: 'adminPass123',
    });
    expect(loginRes.accessToken).toBeDefined();

    // Update order status through lifecycle
    const orderInProgress = await ordersController.updateStatus(order.id, { status: 'in_progress' });
    expect(orderInProgress.status).toBe('in_progress');

    const orderDelivered = await ordersController.updateStatus(order.id, { status: 'delivered' });
    expect(orderDelivered.status).toBe('delivered');

    // Moderate Review
    const approvedReview = await reviewsController.setPublished(review.id, true);
    expect(approvedReview.published).toBe(true);

    // Mark Contact Message as Read
    const readMsg = await contactController.markAsRead(contactMsg.id);
    expect(readMsg.read).toBe(true);

    // 8. Admin Dashboard Metrics Reflection
    const stats = await dashboardController.getDashboardStats();
    expect(stats.totalArticles).toBe(2);
    expect(stats.totalPacks).toBe(1);
    expect(stats.totalOrders).toBe(1);
    expect(stats.ordersByStatus.delivered).toBe(1);
    expect(stats.lowStockArticles.length).toBe(1);
    expect(stats.lowStockArticles[0].sku).toBe('ARABIC-6-TN');
    expect(stats.collectedRevenue).toBe(orderDelivered.total);
  });

  it('should enforce error handling, edge cases, and security boundaries', async () => {
    const userRepo = new JsonUserRepository();
    const artRepo = new JsonArticleRepository();
    const packRepo = new JsonPackRepository();
    const deliveryRepo = new JsonDeliveryRuleRepository();
    const orderRepo = new JsonOrderRepository();

    const jwtService = new JwtService({ secret: JWT_SECRET });
    const authService = new AuthService(userRepo, jwtService);
    const artController = new ArticlesController(artRepo);
    const packController = new PacksController(packRepo);
    const ordersController = new OrdersController(orderRepo, artRepo, packRepo, deliveryRepo);

    // Public Registration Security Boundary: Attempt to pass role 'admin' in registration
    const registerPayload: any = {
      email: 'sneaky@example.tn',
      password: 'password123',
      fullName: 'Sneaky User',
      role: 'admin',
    };
    const customer = await authService.register(registerPayload);
    expect(customer.role).toBe('customer'); // Must enforce 'customer'

    // RolesGuard checks
    const rolesGuard = new RolesGuard({ getAllAndOverride: () => ['admin'] } as any);
    expect(() =>
      rolesGuard.canActivate({
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({ getRequest: () => ({ user: { role: 'customer' } }) }),
      } as any),
    ).toThrow(ForbiddenException);

    // Auth Login Failure
    await expect(
      authService.login({ email: 'nonexistent@example.tn', password: 'pass' }),
    ).rejects.toThrow(UnauthorizedException);

    // Article Validation: negative price
    await expect(
      artController.create({
        sku: 'INV-1',
        name: { ar: 'خطأ' },
        price: -5,
        educationLevelId: 'lvl-1',
      }),
    ).rejects.toThrow(BadRequestException);

    // Article Validation: discountPrice >= price
    await expect(
      artController.create({
        sku: 'INV-2',
        name: { ar: 'خطأ' },
        price: 10,
        discountPrice: 15,
        educationLevelId: 'lvl-1',
      }),
    ).rejects.toThrow(BadRequestException);

    // Pack Validation: duplicate items
    await expect(
      packController.create({
        sku: 'PACK-INV',
        name: { ar: 'حزمة غير صالحة' },
        price: 20,
        items: [
          { articleId: 'art-1', quantity: 1 },
          { articleId: 'art-1', quantity: 1 },
        ],
      }),
    ).rejects.toThrow(BadRequestException);

    // Non-existent order lookup by reference
    await expect(ordersController.getByReference('TN-INVALID-REF')).rejects.toThrow(
      NotFoundException,
    );

    // Rejection without rejectionReason
    const order = await orderRepo.create({
      reference: 'TN-9900',
      customer: {
        fullName: 'Test',
        email: 't@tn.tn',
        phone: '20000000',
        city: 'Tunis',
        address: 'Center',
      },
      items: [],
      subtotal: 20,
      deliveryFee: 7,
      total: 27,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid',
    });

    await expect(ordersController.updateStatus(order.id, { status: 'rejected' })).rejects.toThrow(
      BadRequestException,
    );

    // Valid rejection with rejectionReason
    const rejectedOrder = await ordersController.updateStatus(order.id, {
      status: 'rejected',
      rejectionReason: 'Out of stock in region',
    });
    expect(rejectedOrder.status).toBe('rejected');
    expect(rejectedOrder.rejectionReason).toBe('Out of stock in region');
  });
});
