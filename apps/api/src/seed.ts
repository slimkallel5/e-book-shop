import * as bcrypt from 'bcryptjs';
import {
  JsonArticleRepository,
  JsonDeliveryRuleRepository,
  JsonEducationLevelRepository,
  JsonOrderRepository,
  JsonPackRepository,
  JsonUserRepository,
} from '../src/repositories/json/json-repositories';
import {
  PostgresArticleRepository,
  PostgresDeliveryRuleRepository,
  PostgresEducationLevelRepository,
  PostgresOrderRepository,
  PostgresPackRepository,
} from '../src/repositories/postgres/postgres-repositories';

export const SEED_EDUCATION_LEVELS = [
  {
    code: 'PRIMARY',
    name: { ar: 'التعليم الابتدائي', fr: 'Enseignement Primaire', en: 'Primary Education' },
    category: 'primary' as const,
    displayOrder: 1,
    active: true,
  },
  {
    code: 'MIDDLE',
    name: { ar: 'التعليم الإعدادي', fr: 'Enseignement de Base / Collège', en: 'Middle School' },
    category: 'middle' as const,
    displayOrder: 2,
    active: true,
  },
  {
    code: 'SECONDARY',
    name: { ar: 'التعليم الثانوي', fr: 'Enseignement Secondaire', en: 'Secondary Education' },
    category: 'secondary' as const,
    displayOrder: 3,
    active: true,
  },
];

export const SEED_DELIVERY_RULES = [
  {
    name: { ar: 'شحن عادي', fr: 'Livraison standard', en: 'Standard Delivery' },
    minSubtotal: 0,
    maxSubtotal: 60,
    fee: 7.0,
    isFree: false,
    active: true,
    priority: 1,
  },
  {
    name: { ar: 'شحن مجاني للطلبات الكبيرة', fr: 'Livraison gratuite', en: 'Free Delivery' },
    minSubtotal: 60.001,
    maxSubtotal: undefined,
    fee: 0,
    isFree: true,
    active: true,
    priority: 2,
  },
];

export async function seedJsonData() {
  const edRepo = new JsonEducationLevelRepository();
  const artRepo = new JsonArticleRepository();
  const packRepo = new JsonPackRepository();
  const dlvRepo = new JsonDeliveryRuleRepository();
  const userRepo = new JsonUserRepository();

  const adminEmail = 'admin@ebookshop.tn';
  const existingAdmin = await userRepo.findByEmail(adminEmail);
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await userRepo.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
      fullName: 'مدير النظام',
    });
  }

  const existingLevels = await edRepo.findAll();
  let primaryLevelId = existingLevels.find((l) => l.code === 'PRIMARY')?.id;

  if (existingLevels.length === 0) {
    for (const level of SEED_EDUCATION_LEVELS) {
      const created = await edRepo.create(level);
      if (level.code === 'PRIMARY') primaryLevelId = created.id;
    }
  }

  const existingArticles = await artRepo.findAll();
  let art1Id = existingArticles[0]?.id;

  if (existingArticles.length === 0 && primaryLevelId) {
    const art1 = await artRepo.create({
      sku: 'MATH-P1',
      name: { ar: 'كتاب الرياضيات - السنة الأولى ابتدائي', fr: 'Livre de Mathématiques 1ère Année', en: 'Math Book 1st Grade' },
      description: { ar: 'تمارين وأنشطة شاملة للرياضيات وفق البرنامج التونسي الرسمي', fr: 'Exercices et activités conformes au programme tunisien', en: 'Comprehensive math exercises according to Tunisian curriculum' },
      price: 18.5,
      discountPrice: 15.0,
      stock: 50,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/math1.jpg',
      samplePdfUrl: '/assets/samples/math1.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });
    art1Id = art1.id;

    await artRepo.create({
      sku: 'ARAB-P1',
      name: { ar: 'كتاب القراءة واللغة العربية - السنة الأولى ابتدائي', fr: 'Livre de Langue Arabe 1ère Année', en: 'Arabic Language 1st Grade' },
      description: { ar: 'كتاب متكامل لتعلم الحروف والقراءة للسنوات الأولى', fr: 'Livre complet d\'apprentissage de la langue arabe', en: 'Complete textbook for learning Arabic language' },
      price: 16.0,
      stock: 40,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/arabic1.jpg',
      samplePdfUrl: '/assets/samples/arabic1.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });
  }

  const existingPacks = await packRepo.findAll();
  if (existingPacks.length === 0 && art1Id) {
    await packRepo.create({
      sku: 'PACK-P1-FULL',
      name: { ar: 'حقيبة الكتب الكاملة - السنة الأولى ابتدائي', fr: 'Pack Complet 1ère Année Primaire', en: 'Full Pack 1st Grade' },
      description: { ar: 'تشمل جميع الكتب والكراريس للسنة الأولى ابتدائي', fr: 'Contient tous les manuels scolaires pour la 1ère année', en: 'Includes all required books for 1st grade' },
      price: 32.0,
      discountPrice: 28.0,
      items: [{ articleId: art1Id, quantity: 1 }],
      posterUrl: '/assets/covers/pack1.jpg',
      active: true,
    });
  }

  const existingRules = await dlvRepo.findAll();
  if (existingRules.length === 0) {
    for (const rule of SEED_DELIVERY_RULES) {
      await dlvRepo.create(rule);
    }
  }

  console.log('JSON Seed complete');
}

if (require.main === module) {
  seedJsonData().catch(console.error);
}
