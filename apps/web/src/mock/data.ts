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
  educationSubLevel?: string;
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
    id: 'art-math-p1',
    title: {
      ar: 'كتاب الرياضيات - السنة الأولى ابتدائي',
      fr: 'Livre de Mathématiques 1ère Année',
      en: 'Math Book 1st Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 18.5,
    discountPrice: 15.0,
    educationLevel: 'primary',
    educationSubLevel: '1',
    levelName: {
      ar: 'السنة 1 ابتدائي',
      fr: '1ère Primaire',
      en: '1st Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/math1.jpg',
    samplePages: ['/assets/samples/math1.pdf'],
    description: {
      ar: 'تمارين وأنشطة شاملة للرياضيات وفق البرنامج التونسي الرسمي',
      fr: 'Exercices et activités conformes au programme tunisien',
      en: 'Comprehensive math exercises according to Tunisian curriculum',
    },
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 25,
  },
  {
    id: 'art-arab-p1',
    title: {
      ar: 'كتاب القراءة واللغة العربية - السنة الأولى ابتدائي',
      fr: 'Livre de Langue Arabe 1ère Année',
      en: 'Arabic Language 1st Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 16.0,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 1 ابتدائي',
      fr: '1ère Primaire',
      en: '1st Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/arabic1.jpg',
    samplePages: ['/assets/samples/arabic1.pdf'],
    description: {
      ar: 'كتاب متكامل لتعلم الحروف والقراءة للسنوات الأولى',
      fr: 'Livre complet d\'apprentissage de la langue arabe',
      en: 'Complete textbook for learning Arabic language',
    },
    inStock: true,
    stockCount: 40,
    rating: 4.9,
    reviewCount: 30,
  },
  {
    id: 'art-math-p2',
    title: {
      ar: 'كتاب الرياضيات - السنة الثانية ابتدائي',
      fr: 'Livre de Mathématiques 2ème Année',
      en: 'Math Book 2nd Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 17.5,
    discountPrice: 14.5,
    educationLevel: 'primary',
    educationSubLevel: '2',
    levelName: {
      ar: 'السنة 2 ابتدائي',
      fr: '2ème Primaire',
      en: '2nd Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/math2.jpg',
    samplePages: ['/assets/samples/math2.pdf'],
    description: {
      ar: 'كتاب التلميذ في الحساب والهندسة وتنمية التفكير المنطقي للسنة الثانية',
      fr: 'Manuel de mathématiques et géométrie pour 2ème année primaire',
      en: 'Pupil textbook for arithmetic, geometry and logical thinking',
    },
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: 'art-sci-p2',
    title: {
      ar: 'كتاب الإيقاظ العلمي - السنة الثانية ابتدائي',
      fr: 'Livre d\'Éveil Scientifique 2ème Année',
      en: 'Scientific Awakening 2nd Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 14.0,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 2 ابتدائي',
      fr: '2ème Primaire',
      en: '2nd Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/science2.jpg',
    samplePages: ['/assets/samples/science2.pdf'],
    description: {
      ar: 'أنشطة استكشاف البيئة وجسم الإنسان والتجارب العلمية المبسطة',
      fr: 'Activités d\'exploration de l\'environnement et du corps humain',
      en: 'Exploration of nature, science, and the human body',
    },
    inStock: true,
    stockCount: 35,
    rating: 4.6,
    reviewCount: 14,
  },
  {
    id: 'art-math-p3',
    title: {
      ar: 'كتاب الرياضيات - السنة الثالثة ابتدائي',
      fr: 'Livre de Mathématiques 3ème Année',
      en: 'Math Book 3rd Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 19.0,
    discountPrice: 16.0,
    educationLevel: 'primary',
    educationSubLevel: '3',
    levelName: {
      ar: 'السنة 3 ابتدائي',
      fr: '3ème Primaire',
      en: '3rd Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/math3.jpg',
    samplePages: ['/assets/samples/math3.pdf'],
    description: {
      ar: 'العمليات الحسابية الأساسية والأشكال الهندسية وحل المسائل',
      fr: 'Opérations de calcul, géométrie et résolution de problèmes',
      en: 'Basic mathematical operations, geometry and problem solving',
    },
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 22,
  },
  {
    id: 'art-frn-p3',
    title: {
      ar: 'كتاب الفرنسية للناشئة - السنة الثالثة ابتدائي',
      fr: 'Manuel de Français 3ème Année',
      en: 'French Language 3rd Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 18.0,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 3 ابتدائي',
      fr: '3ème Primaire',
      en: '3rd Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/french3.jpg',
    samplePages: ['/assets/samples/french3.pdf'],
    description: {
      ar: 'انطلاق تعلم اللغة الفرنسية: قراءة وحوارات وأنشطة كتابية أولى',
      fr: 'Initiation à la langue française: lecture, phonétique et dialogue',
      en: 'Introductory French language: phonetics, reading and conversations',
    },
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: 'art-math-p4',
    title: {
      ar: 'كتاب الرياضيات - السنة الرابعة ابتدائي',
      fr: 'Livre de Mathématiques 4ème Année',
      en: 'Math Book 4th Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 19.5,
    discountPrice: 16.5,
    educationLevel: 'primary',
    educationSubLevel: '4',
    levelName: {
      ar: 'السنة 4 ابتدائي',
      fr: '4ème Primaire',
      en: '4th Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/math4.jpg',
    samplePages: ['/assets/samples/math4.pdf'],
    description: {
      ar: 'الأعداد الكبيرة والضرب والقسمة والهندسة التطبيقية والمقادير',
      fr: 'Grands nombres, multiplication, division et calcul des grandeurs',
      en: 'Large numbers, multiplication, division, and applied geometry',
    },
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 27,
  },
  {
    id: 'art-math-p5',
    title: {
      ar: 'كتاب الرياضيات - السنة الخامسة ابتدائي',
      fr: 'Livre de Mathématiques 5ème Année',
      en: 'Math Book 5th Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 20.0,
    discountPrice: 17.0,
    educationLevel: 'primary',
    educationSubLevel: '5',
    levelName: {
      ar: 'السنة 5 ابتدائي',
      fr: '5ème Primaire',
      en: '5th Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/math5.jpg',
    samplePages: ['/assets/samples/math5.pdf'],
    description: {
      ar: 'الأعداد الكسرية والعشرية والنسب المئوية وحساب المساحات المعقدة',
      fr: 'Fractions, nombres décimaux, pourcentages et calcul d\'aires',
      en: 'Fractions, decimals, percentages, and area calculations',
    },
    inStock: true,
    stockCount: 50,
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: 'art-eng-p5',
    title: {
      ar: 'كتاب الانجليزية - السنة الخامسة ابتدائي',
      fr: 'Manuel d\'Anglais 5ème Année',
      en: 'English for Kids 5th Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 17.5,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 5 ابتدائي',
      fr: '5ème Primaire',
      en: '5th Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/english5.jpg',
    samplePages: ['/assets/samples/english5.pdf'],
    description: {
      ar: 'مدخل إلى المحادثة والمفردات وقواعد اللغة الإنجليزية للطور الابتدائي',
      fr: 'Initiation à l\'anglais: phonétique, dialogues et vocabulaire de base',
      en: 'Introduction to spoken English, vocabulary and basic grammar',
    },
    inStock: true,
    stockCount: 40,
    rating: 4.7,
    reviewCount: 16,
  },
  {
    id: 'book-1',
    title: {
      ar: 'كتاب الرياضيات - السنة السادسة ابتدائي (مناظرة السيزيام)',
      fr: 'Manuel de Mathématiques - 6ème Année (Concours)',
      en: 'Mathematics Textbook - 6th Grade (National Exam)',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 21.0,
    discountPrice: 18.0,
    educationLevel: 'primary',
    educationSubLevel: '6',
    levelName: {
      ar: 'السنة 6 ابتدائي',
      fr: '6ème Primaire',
      en: '6th Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/math6.jpg',
    samplePages: ['/assets/samples/math6.pdf'],
    description: {
      ar: 'التحضير الشامل لمناظرة الدخول للمدارس الإعدادية النموذجية مع مسائل وحلول وتطبيقات رسمية.',
      fr: 'Manuel officiel de mathématiques préparatoire au concours d’accès aux collèges pilotes.',
      en: 'Official 6th-grade mathematics exam preparation book for entrance into pilot middle schools.',
    },
    inStock: true,
    stockCount: 60,
    rating: 4.9,
    reviewCount: 45,
  },
  {
    id: 'art-sci-p6',
    title: {
      ar: 'كتاب الإيقاظ العلمي - السنة السادسة ابتدائي',
      fr: 'Livre d\'Éveil Scientifique 6ème Année',
      en: 'Scientific Awakening 6th Grade',
    },
    author: 'المركز الوطني للبيداغوجيا',
    price: 17.5,
    discountPrice: 15.0,
    educationLevel: 'primary',
    levelName: {
      ar: 'السنة 6 ابتدائي',
      fr: '6ème Primaire',
      en: '6th Grade Primary',
    },
    quarter: 'full',
    coverUrl: '/assets/covers/science6.jpg',
    samplePages: ['/assets/samples/science6.pdf'],
    description: {
      ar: 'المفاهيم الفيزيائية والبيولوجية والتحضير لمناظرة السيزيام',
      fr: 'Sciences physiques et naturelles avec exercices types concours',
      en: 'Physical and natural sciences with exam-oriented problems',
    },
    inStock: true,
    stockCount: 40,
    rating: 4.8,
    reviewCount: 23,
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
    educationSubLevel: '9',
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
    educationSubLevel: '4',
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
    educationSubLevel: '6',
    levelName: {
      ar: 'السنة 6 ابتدائي',
      fr: '6ème Primaire',
      en: '6th Grade Primary',
    },
    coverUrl: '/assets/covers/pack1.jpg',
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
