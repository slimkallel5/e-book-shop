import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  ContactController,
  OrdersController,
  ReviewsController,
} from '../src/controllers/orders-and-tools.controller';
import {
  JsonArticleRepository,
  JsonContactRepository,
  JsonDeliveryRuleRepository,
  JsonOrderRepository,
  JsonPackRepository,
  JsonReviewRepository,
} from '../src/repositories/json/json-repositories';

describe('Task 9 - Order Management, Reviews & Contact Form Integration Tests', () => {
  const testDataDir = path.resolve(__dirname, 'tmp-data');

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

  describe('OrdersController & Status Transitions', () => {
    it('should create order and recalculate subtotal and delivery fee server-side', async () => {
      const orderRepo = new JsonOrderRepository();
      const artRepo = new JsonArticleRepository();
      const packRepo = new JsonPackRepository();
      const deliveryRepo = new JsonDeliveryRuleRepository();

      const ordersController = new OrdersController(orderRepo, artRepo, packRepo, deliveryRepo);

      // Create an active article
      const article = await artRepo.create({
        sku: 'ART-TEST-1',
        name: { ar: 'كتاب القراءة' },
        price: 25.0,
        discountPrice: 20.0,
        educationLevelId: 'lvl-1',
        active: true,
      });

      // Create order
      const order = await ordersController.createOrder({
        customer: {
          fullName: 'Sami Ben Ali',
          email: 'sami@example.tn',
          phone: '21698123456',
          city: 'Tunis',
          address: 'Avenue Habib Bourguiba',
        },
        items: [{ type: 'article', itemId: article.id, quantity: 2 }],
        recaptchaToken: 'dev-token',
      });

      expect(order.id).toBeDefined();
      expect(order.reference).toMatch(/^TN-/);
      expect(order.subtotal).toBe(40.0); // 20 * 2
      expect(order.deliveryFee).toBe(7.0); // Default fee
      expect(order.total).toBe(47.0);
      expect(order.status).toBe('pending');
    });

    it('should update status to in_progress and delivered smoothly', async () => {
      const orderRepo = new JsonOrderRepository();
      const artRepo = new JsonArticleRepository();
      const packRepo = new JsonPackRepository();
      const deliveryRepo = new JsonDeliveryRuleRepository();

      const ordersController = new OrdersController(orderRepo, artRepo, packRepo, deliveryRepo);

      const created = await orderRepo.create({
        reference: 'TN-999001',
        customer: {
          fullName: 'Mariem',
          email: 'm@tn.tn',
          phone: '20123456',
          city: 'Sousse',
          address: 'Beach Street',
        },
        items: [],
        subtotal: 50,
        deliveryFee: 7,
        total: 57,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'unpaid',
      });

      const inProgress = await ordersController.updateStatus(created.id, { status: 'in_progress' });
      expect(inProgress.status).toBe('in_progress');

      const delivered = await ordersController.updateStatus(created.id, { status: 'delivered' });
      expect(delivered.status).toBe('delivered');
    });

    it('should throw BadRequestException when rejecting an order without a rejection reason', async () => {
      const orderRepo = new JsonOrderRepository();
      const artRepo = new JsonArticleRepository();
      const packRepo = new JsonPackRepository();
      const deliveryRepo = new JsonDeliveryRuleRepository();

      const ordersController = new OrdersController(orderRepo, artRepo, packRepo, deliveryRepo);

      const created = await orderRepo.create({
        reference: 'TN-999002',
        customer: {
          fullName: 'Ahmed',
          email: 'a@tn.tn',
          phone: '20123457',
          city: 'Sfax',
          address: 'Center Street',
        },
        items: [],
        subtotal: 30,
        deliveryFee: 7,
        total: 37,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'unpaid',
      });

      // Rejecting without rejectionReason must fail
      await expect(
        ordersController.updateStatus(created.id, { status: 'rejected' }),
      ).rejects.toThrow(BadRequestException);

      // Rejecting with rejectionReason must succeed
      const rejected = await ordersController.updateStatus(created.id, {
        status: 'rejected',
        rejectionReason: 'Out of stock',
      });
      expect(rejected.status).toBe('rejected');
      expect(rejected.rejectionReason).toBe('Out of stock');
    });
  });

  describe('ReviewsController', () => {
    it('should submit reviews with unpublished status and allow admin publication toggling', async () => {
      const reviewRepo = new JsonReviewRepository();
      const controller = new ReviewsController(reviewRepo);

      // Create product review
      const review1 = await controller.create({
        articleId: 'art-101',
        rating: 5,
        authorName: 'Youssef',
        comment: 'كتاب رائع جداً',
      });

      expect(review1.id).toBeDefined();
      expect(review1.published).toBe(false); // Moderation queue default

      // Create store review (no articleId)
      const review2 = await controller.create({
        rating: 4,
        authorName: 'Amel',
        comment: 'خدمة سريعة وممتازة',
      });
      expect(review2.published).toBe(false);

      // Published only list should be empty
      const publishedBefore = await controller.getAll(undefined, 'true');
      expect(publishedBefore.length).toBe(0);

      // Approve review1
      const approved = await controller.setPublished(review1.id, true);
      expect(approved.published).toBe(true);

      const publishedAfter = await controller.getAll(undefined, 'true');
      expect(publishedAfter.length).toBe(1);
      expect(publishedAfter[0].id).toBe(review1.id);
    });
  });

  describe('ContactController', () => {
    it('should save contact message and allow marking as read', async () => {
      const contactRepo = new JsonContactRepository();
      const controller = new ContactController(contactRepo);

      const msg = await controller.create({
        name: 'Fatma',
        email: 'fatma@example.tn',
        phone: '98123456',
        subject: 'سؤال حول التوصيل',
        message: 'هل يمكن التوصيل لمناطق القيروان؟',
      });

      expect(msg.id).toBeDefined();
      expect(msg.read).toBe(false);

      const allBefore = await controller.getAll();
      expect(allBefore.length).toBe(1);

      const updated = await controller.markAsRead(msg.id);
      expect(updated.read).toBe(true);
    });
  });
});
