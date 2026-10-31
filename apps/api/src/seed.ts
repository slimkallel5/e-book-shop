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

    await artRepo.create({
      sku: 'MATH-P2',
      name: { ar: 'كتاب الرياضيات - السنة الثانية ابتدائي', fr: 'Livre de Mathématiques 2ème Année', en: 'Math Book 2nd Grade' },
      description: { ar: 'كتاب التلميذ في الحساب والهندسة وتنمية التفكير المنطقي للسنة الثانية', fr: 'Manuel de mathématiques et géométrie pour 2ème année primaire', en: 'Pupil textbook for arithmetic, geometry and logical thinking' },
      price: 17.5,
      discountPrice: 14.5,
      stock: 45,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/math2.jpg',
      samplePdfUrl: '/assets/samples/math2.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'ARAB-P2',
      name: { ar: 'أنيسي في القراءة - السنة الثانية ابتدائي', fr: 'Mon Compagnon de Lecture 2ème Année', en: 'Arabic Reading & Texts 2nd Grade' },
      description: { ar: 'نصوص قرائية شيقة وتمارين لغوية موجهة لتلاميذ السنة الثانية ابتدائي', fr: 'Textes de lecture illustrés et activités d\'expression écrite', en: 'Illustrated reading texts and language practice activities' },
      price: 16.5,
      stock: 40,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/arabic2.jpg',
      samplePdfUrl: '/assets/samples/arabic2.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'SCI-P2',
      name: { ar: 'كتاب الإيقاظ العلمي - السنة الثانية ابتدائي', fr: 'Livre d\'Éveil Scientifique 2ème Année', en: 'Scientific Awakening 2nd Grade' },
      description: { ar: 'أنشطة استكشاف البيئة وجسم الإنسان والتجارب العلمية المبسطة', fr: 'Activités d\'exploration de l\'environnement et du corps humain', en: 'Exploration of nature, science, and the human body' },
      price: 14.0,
      stock: 35,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/science2.jpg',
      samplePdfUrl: '/assets/samples/science2.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'MATH-P3',
      name: { ar: 'كتاب الرياضيات - السنة الثالثة ابتدائي', fr: 'Livre de Mathématiques 3ème Année', en: 'Math Book 3rd Grade' },
      description: { ar: 'العمليات الحسابية الأساسية والأشكال الهندسية وحل المسائل', fr: 'Opérations de calcul, géométrie et résolution de problèmes', en: 'Basic mathematical operations, geometry and problem solving' },
      price: 19.0,
      discountPrice: 16.0,
      stock: 50,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/math3.jpg',
      samplePdfUrl: '/assets/samples/math3.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'FRAN-P3',
      name: { ar: 'كتاب الفرنسية للناشئة - السنة الثالثة ابتدائي', fr: 'Manuel de Français 3ème Année', en: 'French Language 3rd Grade' },
      description: { ar: 'انطلاق تعلم اللغة الفرنسية: قراءة وحوارات وأنشطة كتابية أولى', fr: 'Initiation à la langue française: lecture, phonétique et dialogue', en: 'Introductory French language: phonetics, reading and conversations' },
      price: 18.0,
      stock: 45,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/french3.jpg',
      samplePdfUrl: '/assets/samples/french3.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'SCI-P3',
      name: { ar: 'كتاب الإيقاظ العلمي - السنة الثالثة ابتدائي', fr: 'Livre d\'Éveil Scientifique 3ème Année', en: 'Scientific Awakening 3rd Grade' },
      description: { ar: 'التنفس والتغذية وحالات المادة وفق البرامج الرسمية التونسية', fr: 'Sciences de la vie et de la terre: respiration, alimentation et matière', en: 'Life and earth sciences: respiration, nutrition and matter' },
      price: 15.0,
      stock: 35,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/science3.jpg',
      samplePdfUrl: '/assets/samples/science3.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'MATH-P4',
      name: { ar: 'كتاب الرياضيات - السنة الرابعة ابتدائي', fr: 'Livre de Mathématiques 4ème Année', en: 'Math Book 4th Grade' },
      description: { ar: 'الأعداد الكبيرة والضرب والقسمة والهندسة التطبيقية والمقادير', fr: 'Grands nombres, multiplication, division et calcul des grandeurs', en: 'Large numbers, multiplication, division, and applied geometry' },
      price: 19.5,
      discountPrice: 16.5,
      stock: 50,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/math4.jpg',
      samplePdfUrl: '/assets/samples/math4.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'ARAB-P4',
      name: { ar: 'كتاب القراءة - السنة الرابعة ابتدائي', fr: 'Livre de Lecture Arabe 4ème Année', en: 'Arabic Reading Book 4th Grade' },
      description: { ar: 'نصوص أدبية وقواعد لغوية وإنتاج كتابي متقدم لتلاميذ الرابعة', fr: 'Textes littéraires choisis, grammaire et exercices d\'expression', en: 'Selected literary texts, grammar rules, and composition exercises' },
      price: 17.0,
      stock: 40,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/arabic4.jpg',
      samplePdfUrl: '/assets/samples/arabic4.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'FRAN-P4',
      name: { ar: 'كتاب الفرنسية - السنة الرابعة ابتدائي', fr: 'Manuel de Français 4ème Année', en: 'French Textbook 4th Grade' },
      description: { ar: 'تعزيز الرصيد اللغوي الفرنسي والنصوص القرائية وقواعد الصرف والتحويل', fr: 'Lecture suivie, grammaire, conjugaison et enrichissement lexical', en: 'Reading passages, grammar rules, and vocabulary enrichment' },
      price: 18.5,
      stock: 42,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/french4.jpg',
      samplePdfUrl: '/assets/samples/french4.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'MATH-P5',
      name: { ar: 'كتاب الرياضيات - السنة الخامسة ابتدائي', fr: 'Livre de Mathématiques 5ème Année', en: 'Math Book 5th Grade' },
      description: { ar: 'الأعداد الكسرية والعشرية والنسب المئوية وحساب المساحات المعقدة', fr: 'Fractions, nombres décimaux, pourcentages et calcul d\'aires', en: 'Fractions, decimals, percentages, and area calculations' },
      price: 20.0,
      discountPrice: 17.0,
      stock: 50,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/math5.jpg',
      samplePdfUrl: '/assets/samples/math5.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'SCI-P5',
      name: { ar: 'كتاب الإيقاظ العلمي - السنة الخامسة ابتدائي', fr: 'Livre d\'Éveil Scientifique 5ème Année', en: 'Scientific Awakening 5th Grade' },
      description: { ar: 'الطاقة والكهرباء والتوازن البيئي والأجهزة الوظيفية للإنسان', fr: 'Énergie, électricité, écosystèmes et biologie humaine', en: 'Energy, electricity, ecosystems and human physiology' },
      price: 16.0,
      stock: 38,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/science5.jpg',
      samplePdfUrl: '/assets/samples/science5.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'ENG-P5',
      name: { ar: 'كتاب الانجليزية - السنة الخامسة ابتدائي', fr: 'Manuel d\'Anglais 5ème Année', en: 'English for Kids 5th Grade' },
      description: { ar: 'مدخل إلى المحادثة والمفردات وقواعد اللغة الإنجليزية للطور الابتدائي', fr: 'Initiation à l\'anglais: phonétique, dialogues et vocabulaire de base', en: 'Introduction to spoken English, vocabulary and basic grammar' },
      price: 17.5,
      stock: 40,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/english5.jpg',
      samplePdfUrl: '/assets/samples/english5.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'MATH-P6',
      name: { ar: 'كتاب الرياضيات - السنة السادسة ابتدائي (مناظرة السيزيام)', fr: 'Manuel de Mathématiques 6ème Année (Concours)', en: 'Mathematics Textbook 6th Grade (National Exam)' },
      description: { ar: 'التحضير الشامل لمناظرة الدخول للمدارس الإعدادية النموذجية مع مسائل وحلول', fr: 'Préparation complète au concours d\'accès aux collèges pilotes', en: 'Comprehensive preparation guide for 6th grade pilot entrance exam' },
      price: 21.0,
      discountPrice: 18.0,
      stock: 60,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/math6.jpg',
      samplePdfUrl: '/assets/samples/math6.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'ARAB-P6',
      name: { ar: 'نزهة القارئ في اللغة العربية - السنة السادسة ابتدائي', fr: 'Lectures et Langue Arabe 6ème Année', en: 'Arabic Literature & Language 6th Grade' },
      description: { ar: 'نصوص أدبية وبلاغية رفيعة المستوى لإتقان التعبير واللغة العربية', fr: 'Textes littéraires d\'excellence et perfectionnement grammatical', en: 'High quality literary texts and advanced Arabic grammatical synthesis' },
      price: 18.5,
      stock: 45,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/arabic6.jpg',
      samplePdfUrl: '/assets/samples/arabic6.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'SCI-P6',
      name: { ar: 'كتاب الإيقاظ العلمي - السنة السادسة ابتدائي', fr: 'Livre d\'Éveil Scientifique 6ème Année', en: 'Scientific Awakening 6th Grade' },
      description: { ar: 'المفاهيم الفيزيائية والبيولوجية والتحضير لمناظرة السيزيام', fr: 'Sciences physiques et naturelles avec exercices types concours', en: 'Physical and natural sciences with exam-oriented problems' },
      price: 17.5,
      discountPrice: 15.0,
      stock: 40,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/science6.jpg',
      samplePdfUrl: '/assets/samples/science6.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'FRAN-P6',
      name: { ar: 'كتاب الفرنسية - السنة السادسة ابتدائي', fr: 'Manuel de Français 6ème Année', en: 'French Coursebook 6th Grade' },
      description: { ar: 'القراءة المنهجية وقواعد اللغة والإنتاج الكتابي لاختبار السيزيام', fr: 'Compréhension de l\'écrit, grammaire approfondie et production écrite', en: 'Reading comprehension, in-depth grammar and written composition' },
      price: 19.0,
      stock: 45,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/french6.jpg',
      samplePdfUrl: '/assets/samples/french6.pdf',
      author: 'المركز الوطني للبيداغوجيا',
      publisher: 'CNP',
      active: true,
    });

    await artRepo.create({
      sku: 'ENG-P6',
      name: { ar: 'كتاب الانجليزية - السنة السادسة ابتدائي', fr: 'Manuel d\'Anglais 6ème Année', en: 'English Coursebook 6th Grade' },
      description: { ar: 'تطوير مهارات الاستماع والمحادثة والتعبير الكتابي باللغة الإنجليزية', fr: 'Développement des compétences orales et écrites en anglais', en: 'Development of listening, speaking and writing skills in English' },
      price: 18.0,
      stock: 40,
      educationLevelId: primaryLevelId,
      quarter: 'ALL_YEAR',
      posterUrl: '/assets/covers/english6.jpg',
      samplePdfUrl: '/assets/samples/english6.pdf',
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
