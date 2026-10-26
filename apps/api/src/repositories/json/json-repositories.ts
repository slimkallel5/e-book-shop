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
import { JsonStorage } from './json-storage';

@Injectable()
export class JsonEducationLevelRepository implements IEducationLevelRepository {
  private storage = new JsonStorage<EducationLevel>('education-levels.json');

  async findAll(): Promise<EducationLevel[]> {
    const items = await this.storage.readAll();
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async findById(id: string): Promise<EducationLevel | null> {
    return this.storage.findById(id);
  }

  async create(data: Omit<EducationLevel, 'id' | 'createdAt' | 'updatedAt'>): Promise<EducationLevel> {
    const now = new Date().toISOString();
    const item: EducationLevel = {
      ...data,
      id: `ed_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(item);
  }
}

@Injectable()
export class JsonArticleRepository implements IArticleRepository {
  private storage = new JsonStorage<Article>('articles.json');

  async findAll(filters?: { educationLevelId?: string; activeOnly?: boolean; search?: string }): Promise<Article[]> {
    let items = await this.storage.readAll();
    if (filters?.activeOnly) {
      items = items.filter((a) => a.active);
    }
    if (filters?.educationLevelId) {
      items = items.filter((a) => a.educationLevelId === filters.educationLevelId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.name.ar?.toLowerCase().includes(q) ||
          a.name.fr?.toLowerCase().includes(q) ||
          a.name.en?.toLowerCase().includes(q) ||
          a.sku.toLowerCase().includes(q),
      );
    }
    return items;
  }

  async findById(id: string): Promise<Article | null> {
    return this.storage.findById(id);
  }

  async create(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    const now = new Date().toISOString();
    const item: Article = {
      ...data,
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(item);
  }

  async update(id: string, data: Partial<Article>): Promise<Article | null> {
    return this.storage.update(id, { ...data, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }
}

@Injectable()
export class JsonPackRepository implements IPackRepository {
  private storage = new JsonStorage<Pack>('packs.json');

  async findAll(filters?: { activeOnly?: boolean; search?: string }): Promise<Pack[]> {
    let items = await this.storage.readAll();
    if (filters?.activeOnly) {
      items = items.filter((p) => p.active);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.ar?.toLowerCase().includes(q) ||
          p.name.fr?.toLowerCase().includes(q) ||
          p.name.en?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q),
      );
    }
    return items;
  }

  async findById(id: string): Promise<Pack | null> {
    return this.storage.findById(id);
  }

  async create(data: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pack> {
    const now = new Date().toISOString();
    const item: Pack = {
      ...data,
      id: `pack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(item);
  }

  async update(id: string, data: Partial<Pack>): Promise<Pack | null> {
    return this.storage.update(id, { ...data, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }
}

@Injectable()
export class JsonDeliveryRuleRepository implements IDeliveryRuleRepository {
  private storage = new JsonStorage<DeliveryRule>('delivery-rules.json');

  async findAll(activeOnly?: boolean): Promise<DeliveryRule[]> {
    let items = await this.storage.readAll();
    if (activeOnly) {
      items = items.filter((r) => r.active);
    }
    return items.sort((a, b) => a.priority - b.priority);
  }

  async findById(id: string): Promise<DeliveryRule | null> {
    return this.storage.findById(id);
  }

  async create(data: Omit<DeliveryRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryRule> {
    const now = new Date().toISOString();
    const item: DeliveryRule = {
      ...data,
      id: `dlv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(item);
  }

  async update(id: string, data: Partial<DeliveryRule>): Promise<DeliveryRule | null> {
    return this.storage.update(id, { ...data, updatedAt: new Date().toISOString() });
  }
}

@Injectable()
export class JsonOrderRepository implements IOrderRepository {
  private storage = new JsonStorage<Order>('orders.json');

  async findAll(filters?: { status?: string; search?: string }): Promise<Order[]> {
    let items = await this.storage.readAll();
    if (filters?.status) {
      items = items.filter((o) => o.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q),
      );
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findById(id: string): Promise<Order | null> {
    return this.storage.findById(id);
  }

  async findByReference(reference: string): Promise<Order | null> {
    const items = await this.storage.readAll();
    return items.find((o) => o.reference.toUpperCase() === reference.toUpperCase()) || null;
  }

  async create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const now = new Date().toISOString();
    const item: Order = {
      ...data,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(item);
  }

  async updateStatus(id: string, status: Order['status'], rejectionReason?: string): Promise<Order | null> {
    return this.storage.update(id, {
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      updatedAt: new Date().toISOString(),
    });
  }
}

@Injectable()
export class JsonReviewRepository implements IReviewRepository {
  private storage = new JsonStorage<Review>('reviews.json');

  async findAll(filters?: { articleId?: string; publishedOnly?: boolean }): Promise<Review[]> {
    let items = await this.storage.readAll();
    if (filters?.publishedOnly) {
      items = items.filter((r) => r.published);
    }
    if (filters?.articleId !== undefined) {
      items = items.filter((r) => r.articleId === filters.articleId);
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const item: Review = {
      ...data,
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    return this.storage.create(item);
  }

  async updatePublished(id: string, published: boolean): Promise<Review | null> {
    return this.storage.update(id, { published });
  }
}

@Injectable()
export class JsonContactRepository implements IContactRepository {
  private storage = new JsonStorage<ContactMessage>('contact-messages.json');

  async findAll(): Promise<ContactMessage[]> {
    const items = await this.storage.readAll();
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    const item: ContactMessage = {
      ...data,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    return this.storage.create(item);
  }

  async markAsRead(id: string): Promise<ContactMessage | null> {
    return this.storage.update(id, { read: true });
  }
}
