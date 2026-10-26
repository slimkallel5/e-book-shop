import {
  Article,
  ContactMessage,
  DeliveryRule,
  EducationLevel,
  Order,
  Pack,
  Review,
} from '../common/interfaces/domain.interface';

export interface IEducationLevelRepository {
  findAll(): Promise<EducationLevel[]>;
  findById(id: string): Promise<EducationLevel | null>;
  create(data: Omit<EducationLevel, 'id' | 'createdAt' | 'updatedAt'>): Promise<EducationLevel>;
}

export interface IArticleRepository {
  findAll(filters?: { educationLevelId?: string; activeOnly?: boolean; search?: string }): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article>;
  update(id: string, data: Partial<Article>): Promise<Article | null>;
  delete(id: string): Promise<boolean>;
}

export interface IPackRepository {
  findAll(filters?: { activeOnly?: boolean; search?: string }): Promise<Pack[]>;
  findById(id: string): Promise<Pack | null>;
  create(data: Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pack>;
  update(id: string, data: Partial<Pack>): Promise<Pack | null>;
  delete(id: string): Promise<boolean>;
}

export interface IDeliveryRuleRepository {
  findAll(activeOnly?: boolean): Promise<DeliveryRule[]>;
  findById(id: string): Promise<DeliveryRule | null>;
  create(data: Omit<DeliveryRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<DeliveryRule>;
  update(id: string, data: Partial<DeliveryRule>): Promise<DeliveryRule | null>;
}

export interface IOrderRepository {
  findAll(filters?: { status?: string; search?: string }): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByReference(reference: string): Promise<Order | null>;
  create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateStatus(id: string, status: Order['status'], rejectionReason?: string): Promise<Order | null>;
}

export interface IReviewRepository {
  findAll(filters?: { articleId?: string; publishedOnly?: boolean }): Promise<Review[]>;
  create(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
  updatePublished(id: string, published: boolean): Promise<Review | null>;
}

export interface IContactRepository {
  findAll(): Promise<ContactMessage[]>;
  create(data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage>;
  markAsRead(id: string): Promise<ContactMessage | null>;
}
