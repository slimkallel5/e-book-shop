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
