export interface Book {
  id: string;
  title: {
    ar: string;
    fr: string;
    en: string;
  };
  author?: string;
  price: number;
  discountPrice?: number;
  educationLevel: 'primary' | 'middle' | 'secondary';
  levelName: {
    ar: string;
    fr: string;
    en: string;
  };
  quarter?: 'q1' | 'q2' | 'q3' | 'full';
  coverUrl: string;
  samplePages?: string[]; // Array of SVG or sample page URLs
  description: {
    ar: string;
    fr: string;
    en: string;
  };
  isPack?: boolean;
  includedBookIds?: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
}

export interface Article {
  id: string;
  title: {
    ar: string;
    fr: string;
    en: string;
  };
  excerpt: {
    ar: string;
    fr: string;
    en: string;
  };
  content: {
    ar: string;
    fr: string;
    en: string;
  };
  category: {
    ar: string;
    fr: string;
    en: string;
  };
  author: string;
  date: string;
  readTime: string;
  coverUrl: string;
  featured?: boolean;
}

export interface EducationLevel {
  id: 'primary' | 'middle' | 'secondary';
  spineColor: string;
  title: {
    ar: string;
    fr: string;
    en: string;
  };
  subTitle: {
    ar: string;
    fr: string;
    en: string;
  };
}

export const EDUCATION_LEVELS: EducationLevel[] = [
  {
    id: 'primary',
    spineColor: '#2E7D32', // Emerald Green
    title: {
      ar: 'المرحلة الابتدائية',
      fr: 'Enseignement Primaire',
      en: 'Primary Education',
    },
    subTitle: {
      ar: 'من السنة 1 إلى السنة 6',
      fr: '1ère à 6ème année',
      en: 'Grades 1 to 6',
    },
  },
  {
    id: 'middle',
    spineColor: '#1565C0', // Cobalt Blue
    title: {
      ar: 'المرحلة الإعدادية',
      fr: 'Enseignement de Base',
      en: 'Middle School',
    },
    subTitle: {
      ar: 'من السنة 7 إلى السنة 9',
      fr: '7ème à 9ème année',
      en: 'Grades 7 to 9',
    },
  },
  {
    id: 'secondary',
    spineColor: '#C29B38', // Muted Gold
    title: {
      ar: 'المرحلة الثانوية',
      fr: 'Enseignement Secondaire',
      en: 'Secondary Education',
    },
    subTitle: {
      ar: 'من السنة 1 ثانوي إلى البكالوريا',
      fr: '1ère sec. au Baccalauréat',
      en: 'Grade 10 to Baccalaureate',
    },
  },
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: {
      ar: 'كتاب الرياضيات - السنة السادسة ابتدائي',
      fr: 'Manuel de Mathématiques - 6ème Année',
      en: 'Mathematics Textbook - 6th Grade',
    },
    author: 'المركز الوطني للبيspace والتأليف',
    price: 12.5,
    discountPrice: 10.0,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 6 ابتدائي',
      fr: '6ème Primaire',
      en: '6th Grade Primary',
    },
    quarter: 'full',
    coverUrl: 'https://placehold.co/300x424/123B2B/FAF8F5?text=Maths+6ème',
    samplePages: [
      'https://placehold.co/600x848/FAF8F5/123B2B?text=الصفحة+1:+الأعداد+والحساب',
      'https://placehold.co/600x848/FAF8F5/123B2B?text=الصفحة+2:+الهندسة+الفضائية',
      'https://placehold.co/600x848/FAF8F5/123B2B?text=الصفحة+3:+تمارين+تطبيقية',
    ],
    description: {
      ar: 'الكتاب المدرسي الرسمي لمادة الرياضيات للسنة السادسة ابتدائي. يتضمن تمارين محلولة وأنشطة تفاعلية تطابق البرنامج التونسي.',
      fr: 'Manuel scolaire officiel de mathématiques pour la 6ème année primaire conforme au programme tunisien.',
      en: 'Official 6th-grade mathematics textbook fully aligned with the Tunisian curriculum.',
    },
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewCount: 32,
  },
  {
    id: 'book-2',
    title: {
      ar: 'مسار النجاح في العلوم الفزيائية - 9 أساسي',
      fr: 'Réussite en Sciences Physiques - 9ème',
      en: 'Success in Physical Sciences - 9th Grade',
    },
    author: 'أستاذ خبير بالتأليف',
    price: 18.0,
    educationLevel: 'middle',
    levelName: {
      ar: 'السنة 9 أساسي',
      fr: '9ème Base',
      en: '9th Grade Middle',
    },
    quarter: 'q1',
    coverUrl: 'https://placehold.co/300x424/8B5A2B/FAF8F5?text=Physique+9ème',
    samplePages: [
      'https://placehold.co/600x848/FAF8F5/8B5A2B?text=الصفحة+1:+الكهرباء+والتغذية',
      'https://placehold.co/600x848/FAF8F5/8B5A2B?text=الصفحة+2:+التحولات+الفيزيائية',
    ],
    description: {
      ar: 'كتاب موجه لتلاميد السنة التاسعة أساسي للتحضير لامتحان شهادة ختم التعليم الأساسي (النوفيام).',
      fr: 'Ouvrage de révision et d’exercices corrigés pour les élèves de 9ème année fondamentale.',
      en: 'Comprehensive revision guide for 9th-grade physical sciences.',
    },
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: 'book-3',
    title: {
      ar: 'المكتسبات الأساسية في اللغة العربية - بكالوريا',
      fr: 'Langue Arabe - Baccalauréat',
      en: 'Arabic Language Mastery - Baccalaureate',
    },
    author: 'مجموعة من المتفقين',
    price: 22.0,
    discountPrice: 19.5,
    educationLevel: 'secondary',
    levelName: {
      ar: 'البكالوريا - جميع الشعب',
      fr: 'Baccalauréat Toutes Sections',
      en: 'Baccalaureate All Sections',
    },
    quarter: 'full',
    coverUrl: 'https://placehold.co/300x424/C29B38/123B2B?text=العربية+بكالوريا',
    samplePages: [
      'https://placehold.co/600x848/FAF8F5/123B2B?text=دراسة+النص:+الشعر+الحديث',
      'https://placehold.co/600x848/FAF8F5/123B2B?text=قواعد+اللغة:+البلاغة+والحجاج',
    ],
    description: {
      ar: 'دليل جامع شامل لجميع محاور برنامج اللغة العربية لجميع شعب البكالوريا التونسية مع مواضيع مدرجة.',
      fr: 'Guide complet pour l’épreuve de langue arabe au Baccalauréat tunisien.',
      en: 'Complete review guide for the Arabic exam in the Tunisian Baccalaureate.',
    },
    inStock: true,
    stockCount: 15,
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: 'pack-1',
    title: {
      ar: 'حزمة التفوق الشاملة - السنة السادسة ابتدائي',
      fr: 'Pack Excellence - 6ème Année Primaire',
      en: 'Excellence Pack - 6th Grade Primary',
    },
    price: 35.0,
    discountPrice: 28.0,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 6 ابتدائي',
      fr: '6ème Primaire',
      en: '6th Grade Primary',
    },
    coverUrl: 'https://placehold.co/300x424/7B1FA2/FAF8F5?text=Pack+6ème+Excellence',
    samplePages: [
      'https://placehold.co/600x848/FAF8F5/7B1FA2?text=معاينة+حزمة+التفوق',
    ],
    description: {
      ar: 'حزمة متميزة تجمع الكتب الأساسية (الرياضيات، العربية، العلوم) للسنة السادسة ابتدائي بسعر مخفض.',
      fr: 'Pack complet incluant les manuels essentiels pour réussir le concours de 6ème.',
      en: 'Comprehensive pack including key textbooks for 6th grade success.',
    },
    isPack: true,
    includedBookIds: ['book-1'],
    inStock: true,
    stockCount: 10,
    rating: 5.0,
    reviewCount: 12,
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: {
      ar: 'إستراتيجيات المراجعة الذكية لامتحان البكالوريا التونسية',
      fr: 'Stratégies de Révision Intelligentes pour le Baccalauréat',
      en: 'Smart Revision Strategies for the Tunisian Baccalaureate',
    },
    excerpt: {
      ar: 'دليل شامل يوضح كيفية تنظيم الجدول الزمني والتعامل مع الضغط النفسي لتحقيق أرفع الدرجات.',
      fr: 'Un guide méthodologique complet pour organiser votre temps et maîtriser le stress des examens.',
      en: 'A comprehensive study guide on managing study schedules and exam stress effectively.',
    },
    content: {
      ar: 'يتطلب اجتياز امتحان البكالوريا بنجاح تخطيطاً محكماً منذ بداية السنة الدراسية. في هذا المقال، يقدم خبراء التربية أهم النصائح لتقسيم المواد، حل المواضيع السابقة، والاعتماد على الملخصات المركزة لتثبيت المفاهيم الأساسية.',
      fr: 'La réussite au Baccalauréat repose sur une organisation rigoureuse tout au long de l’année. Nos conseillers pédagogiques partagent les meilleures méthodes pour optimiser les révisions et réussir les épreuves écrites.',
      en: 'Success in the Baccalaureate exam relies on disciplined preparation throughout the academic year. Educational experts share essential tips for managing study hours and practicing past exam papers.',
    },
    category: {
      ar: 'توجيه وبكالوريا',
      fr: 'Orientation & Bac',
      en: 'Guidance & Bac',
    },
    author: 'د. سامي العبيدي',
    date: '2025-02-15',
    readTime: '5 min',
    coverUrl: 'https://placehold.co/600x400/123B2B/FAF8F5?text=Bac+Revision+Guide',
    featured: true,
  },
  {
    id: 'art-2',
    title: {
      ar: 'كيف تطور مهارات الرياضيات في المرحلة الإعدادية؟',
      fr: 'Comment Exceller en Mathématiques au Collège ?',
      en: 'How to Master Middle School Mathematics?',
    },
    excerpt: {
      ar: 'خطوات تطبيقية لبناء الفكر المنطقي وحل المسائل الهندسية بسهولة ويسر.',
      fr: 'Des méthodes pragmatiques pour développer le raisonnement logique et résoudre la géométrie.',
      en: 'Practical techniques to build problem-solving skills and master geometry concepts.',
    },
    content: {
      ar: 'الرياضيات مادة تراكمية تعتمد على الفهم العميق للقواعد الأساسية. نناقش هنا كيفية التغلب على صعوبات الهندسة والتمارين المنطقية من خلال التدريب اليومي وحل المسائل المتميزة.',
      fr: 'Les mathématiques exigent rigueur et pratique régulière. Découvrez comment maîtriser la géométrie et l’algèbre grâce à des exercices guidés et structurés.',
      en: 'Mathematics requires consistent practice and conceptual clarity. Explore how to master geometry and algebra with structured problem sets.',
    },
    category: {
      ar: 'العلوم والرياضيات',
      fr: 'Sciences & Maths',
      en: 'STEM & Maths',
    },
    author: 'أستاذة منى بن صالح',
    date: '2025-02-10',
    readTime: '4 min',
    coverUrl: 'https://placehold.co/600x400/1565C0/FAF8F5?text=Maths+Mastery',
    featured: true,
  },
  {
    id: 'art-3',
    title: {
      ar: 'أهمية المطالعة الحرة في بناء شخصية التلميذ في الابتدائي',
      fr: 'L’Importance de la Lecture Plaisir au Primaire',
      en: 'The Power of Reading for Pleasure in Primary School',
    },
    excerpt: {
      ar: 'كيف تساهم القراءة اللاصفية في إثراء الرصيد اللغوي وتطوير الخيال لدى الأطفال.',
      fr: 'Comment la lecture autonome enrichit le vocabulaire et stimule l’imagination des jeunes enfants.',
      en: 'How extracurricular reading boosts vocabulary and stimulates children’s imagination.',
    },
    content: {
      ar: 'المطالعة هي المفتاح الأساسي للتفوق في كافة المواد اللغوية والإنسانية. نبرز في هذا المقال دور القصص المصورة والمكتبات الرقمية في ترغيب الناشئة في قراءة الكتب.',
      fr: 'La lecture est la clé du succès scolaire et de l’épanouissement personnel. Découvrez nos conseils pour donner le goût de lire aux enfants dès le plus jeune âge.',
      en: 'Reading is the foundation for academic success and cognitive development. Learn how interactive storybooks motivate young learners to read.',
    },
    category: {
      ar: 'القراءة والتربية',
      fr: 'Pédagogie & Lecture',
      en: 'Pedagogy & Reading',
    },
    author: 'أ. كريمة الطرابلسي',
    date: '2025-01-28',
    readTime: '6 min',
    coverUrl: 'https://placehold.co/600x400/2E7D32/FAF8F5?text=Primary+Reading',
    featured: true,
  },
  {
    id: 'art-4',
    title: {
      ar: 'استخدام التكنولوجيا الرقمية والوسائط التفاعلية في التعليم',
      fr: 'Le Rôle des Technologies Numériques dans l’Éducation',
      en: 'The Role of Digital Interactive Media in Modern Education',
    },
    excerpt: {
      ar: 'رؤية مستقبلية حول دمج الكتاب الرقمي ثلاثي الأبعاد والوسائط التفاعلية في المناهج.',
      fr: 'Une vision prospective sur l’intégration des livres 3D et des médias interactifs dans l’apprentissage.',
      en: 'An insightful analysis of integrating 3D digital textbooks into classroom learning.',
    },
    content: {
      ar: 'تحول التعلم من النموذج التقليدي إلى التجربة التفاعلية الثلاثية الأبعاد، مما يزيد من تركيز التلاميذ ويفتح آفاقاً جديدة للاستكشاف والابتكار.',
      fr: 'L’intégration de supports interactifs 3D transforme la perception des manuels scolaires et augmente l’engagement des élèves.',
      en: 'Integrating 3D interactive elements transforms textbook engagement and creates immersive learning experiences.',
    },
    category: {
      ar: 'تكنولوجيا التعليم',
      fr: 'EdTech & Innovation',
      en: 'EdTech & Innovation',
    },
    author: 'م. كريم الماجري',
    date: '2025-01-15',
    readTime: '5 min',
    coverUrl: 'https://placehold.co/600x400/7B1FA2/FAF8F5?text=Digital+Education',
    featured: false,
  },
];
