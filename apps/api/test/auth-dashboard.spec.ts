import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { JWT_SECRET, JwtAuthGuard } from '../src/auth/auth.guard';
import { AuthService } from '../src/auth/auth.service';
import { RolesGuard } from '../src/auth/roles.guard';
import { AdminDashboardController } from '../src/controllers/admin-dashboard.controller';
import {
  JsonArticleRepository,
  JsonOrderRepository,
  JsonPackRepository,
  JsonReviewRepository,
  JsonUserRepository,
} from '../src/repositories/json/json-repositories';

describe('Admin Auth & Dashboard Metrics Integration Tests', () => {
  const testDataDir = path.resolve(__dirname, 'tmp-auth-data');

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

  it('should create customer on public register and NEVER grant admin privileges', async () => {
    const userRepo = new JsonUserRepository();
    const jwtService = new JwtService({ secret: JWT_SECRET });
    const authService = new AuthService(userRepo, jwtService);

    const registered = await authService.register({
      email: 'customer@example.tn',
      password: 'password123',
      fullName: 'Aymen Customer',
    });

    expect(registered.id).toBeDefined();
    expect(registered.role).toBe('customer');

    const dbUser = await userRepo.findByEmail('customer@example.tn');
    expect(dbUser?.role).toBe('customer');
  });

  it('should reject registration if email already exists', async () => {
    const userRepo = new JsonUserRepository();
    const jwtService = new JwtService({ secret: JWT_SECRET });
    const authService = new AuthService(userRepo, jwtService);

    await authService.register({
      email: 'dupe@example.tn',
      password: 'pass',
      fullName: 'User 1',
    });

    await expect(
      authService.register({
        email: 'dupe@example.tn',
        password: 'pass',
        fullName: 'User 2',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should authenticate admin with correct password and reject invalid password', async () => {
    const userRepo = new JsonUserRepository();
    const jwtService = new JwtService({ secret: JWT_SECRET });
    const authService = new AuthService(userRepo, jwtService);

    const passwordHash = await bcrypt.hash('adminSecret123', 10);
    await userRepo.create({
      email: 'admin@ebookshop.tn',
      passwordHash,
      fullName: 'System Admin',
      role: 'admin',
    });

    // Valid login
    const loginRes = await authService.login({
      email: 'admin@ebookshop.tn',
      password: 'adminSecret123',
    });

    expect(loginRes.accessToken).toBeDefined();
    expect(loginRes.user.role).toBe('admin');

    // Verify JWT payload
    const decoded: any = jwtService.verify(loginRes.accessToken, { secret: JWT_SECRET });
    expect(decoded.role).toBe('admin');
    expect(decoded.email).toBe('admin@ebookshop.tn');

    // Invalid password
    await expect(
      authService.login({
        email: 'admin@ebookshop.tn',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should deny non-admin users in RolesGuard', () => {
    const reflectorMock: any = {
      getAllAndOverride: () => ['admin'],
    };
    const rolesGuard = new RolesGuard(reflectorMock);

    const customerCtxMock: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'customer' } }),
      }),
    };

    expect(() => rolesGuard.canActivate(customerCtxMock)).toThrow(ForbiddenException);

    const adminCtxMock: any = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
    };

    expect(rolesGuard.canActivate(adminCtxMock)).toBe(true);
  });

  it('should compute dashboard metrics correctly', async () => {
    const artRepo = new JsonArticleRepository();
    const packRepo = new JsonPackRepository();
    const orderRepo = new JsonOrderRepository();
    const reviewRepo = new JsonReviewRepository();

    const controller = new AdminDashboardController(artRepo, packRepo, orderRepo, reviewRepo);

    // Create 2 articles (1 with low stock)
    await artRepo.create({
      sku: 'ART-1',
      name: { ar: 'كتاب 1' },
      price: 20,
      stock: 5, // Low stock
      educationLevelId: 'lvl-1',
      active: true,
    });
    await artRepo.create({
      sku: 'ART-2',
      name: { ar: 'كتاب 2' },
      price: 30,
      stock: 100,
      educationLevelId: 'lvl-1',
      active: true,
    });

    // Create 1 pack
    await packRepo.create({
      sku: 'PACK-1',
      name: { ar: 'حزمة 1' },
      price: 45,
      items: [{ articleId: 'ART-1', quantity: 1 }],
      active: true,
    });

    // Create 1 pending order and 1 delivered order
    await orderRepo.create({
      reference: 'TN-1001',
      customer: {
        fullName: 'Omar',
        email: 'omar@tn.tn',
        phone: '98000000',
        city: 'Tunis',
        address: 'Centre Ville',
      },
      items: [],
      subtotal: 50,
      deliveryFee: 7,
      total: 57,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid',
    });

    await orderRepo.create({
      reference: 'TN-1002',
      customer: {
        fullName: 'Sami',
        email: 'sami@tn.tn',
        phone: '97000000',
        city: 'Sousse',
        address: 'Kantaoui',
      },
      items: [],
      subtotal: 100,
      deliveryFee: 0,
      total: 100,
      status: 'delivered',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'paid',
    });

    const stats = await controller.getDashboardStats();

    expect(stats.totalArticles).toBe(2);
    expect(stats.totalPacks).toBe(1);
    expect(stats.totalOrders).toBe(2);
    expect(stats.ordersByStatus.pending).toBe(1);
    expect(stats.ordersByStatus.delivered).toBe(1);
    expect(stats.orderValue).toBe(157); // 57 + 100
    expect(stats.collectedRevenue).toBe(100); // Only delivered/paid order
    expect(stats.lowStockArticles.length).toBe(1);
    expect(stats.lowStockArticles[0].sku).toBe('ART-1');
  });
});
