import { Book, MOCK_BOOKS } from '../mock/data';

const RAW_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL || '';
const CLEAN_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export const API_BASE_URL = CLEAN_BASE_URL
  ? (CLEAN_BASE_URL.endsWith('/api/v1') ? CLEAN_BASE_URL : `${CLEAN_BASE_URL}/api/v1`)
  : '/api/v1';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api/v1/')) {
    return `${API_BASE_URL}${cleanEndpoint.slice(7)}`;
  }
  if (cleanEndpoint === '/api/v1') {
    return API_BASE_URL;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export interface ApiArticle {
  id: string;
  sku: string;
  name: { ar: string; fr?: string; en?: string };
  description?: { ar: string; fr?: string; en?: string };
  price: number;
  discountPrice?: number;
  stock?: number;
  educationLevelId: string;
  educationSubLevel?: string;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR';
  posterUrl?: string;
  samplePdfUrl?: string;
  author?: string;
  publisher?: string;
  active: boolean;
}

export interface ApiPack {
  id: string;
  sku: string;
  name: { ar: string; fr?: string; en?: string };
  description?: { ar: string; fr?: string; en?: string };
  price: number;
  discountPrice?: number;
  items: Array<{ articleId: string; quantity: number }>;
  posterUrl?: string;
  active: boolean;
}

export interface ApiEducationLevel {
  id: string;
  code: string;
  name: { ar: string; fr?: string; en?: string };
  category: 'primary' | 'middle' | 'secondary' | 'other';
  displayOrder: number;
  active: boolean;
}

function mapQuarter(quarter?: string): 'q1' | 'q2' | 'q3' | 'full' | undefined {
  if (!quarter) return undefined;
  const q = quarter.toLowerCase();
  if (q === 'q1') return 'q1';
  if (q === 'q2') return 'q2';
  if (q === 'q3') return 'q3';
  return 'full';
}

function mapEducationLevelCategory(
  category?: string,
  code?: string,
): 'primary' | 'middle' | 'secondary' {
  if (category === 'middle' || code?.includes('middle')) return 'middle';
  if (category === 'secondary' || code?.includes('sec')) return 'secondary';
  return 'primary';
}

export function articleToBook(article: ApiArticle, levelsMap: Map<string, ApiEducationLevel>): Book {
  const levelObj = levelsMap.get(article.educationLevelId);
  const edLevel = mapEducationLevelCategory(levelObj?.category, levelObj?.code);

  const levelName = {
    ar: levelObj?.name.ar || 'المرحلة الدراسية',
    fr: levelObj?.name.fr || levelObj?.name.ar || 'Niveau Éducatif',
    en: levelObj?.name.en || levelObj?.name.ar || 'Education Level',
  };

  const title = {
    ar: article.name.ar,
    fr: article.name.fr || article.name.ar,
    en: article.name.en || article.name.ar,
  };

  const description = {
    ar: article.description?.ar || '',
    fr: article.description?.fr || article.description?.ar || '',
    en: article.description?.en || article.description?.ar || '',
  };

  return {
    id: article.id,
    title,
    author: article.author || article.publisher,
    price: article.price,
    discountPrice: article.discountPrice,
    educationLevel: edLevel,
    educationSubLevel: article.educationSubLevel,
    levelName,
    quarter: mapQuarter(article.quarter),
    coverUrl: article.posterUrl || 'https://placehold.co/300x424/123B2B/FAF8F5?text=Cover',
    samplePages: article.samplePdfUrl ? [article.samplePdfUrl] : undefined,
    description,
    inStock: (article.stock === undefined || article.stock > 0) && article.active,
    stockCount: article.stock ?? 99,
    rating: 4.8,
    reviewCount: 15,
  };
}

export function packToBook(pack: ApiPack): Book {
  const title = {
    ar: pack.name.ar,
    fr: pack.name.fr || pack.name.ar,
    en: pack.name.en || pack.name.ar,
  };

  const description = {
    ar: pack.description?.ar || '',
    fr: pack.description?.fr || pack.description?.ar || '',
    en: pack.description?.en || pack.description?.ar || '',
  };

  return {
    id: pack.id,
    title,
    price: pack.price,
    discountPrice: pack.discountPrice,
    educationLevel: 'primary',
    levelName: {
      ar: 'حزمة تعليمية',
      fr: 'Pack Éducatif',
      en: 'Educational Pack',
    },
    coverUrl: pack.posterUrl || 'https://placehold.co/300x424/7B1FA2/FAF8F5?text=Pack',
    description,
    isPack: true,
    includedBookIds: pack.items.map((i) => i.articleId),
    inStock: pack.active,
    stockCount: 50,
    rating: 5.0,
    reviewCount: 10,
  };
}

export async function fetchCatalogBooks(): Promise<Book[]> {
  try {
    const [articlesRes, packsRes, levelsRes] = await Promise.all([
      fetch(getApiUrl('/articles?activeOnly=true')),
      fetch(getApiUrl('/packs?activeOnly=true')),
      fetch(getApiUrl('/education-levels')),
    ]);

    if (!articlesRes.ok || !packsRes.ok || !levelsRes.ok) {
      throw new Error('API request failed');
    }

    const articles: ApiArticle[] = await articlesRes.json();
    const packs: ApiPack[] = await packsRes.json();
    const levels: ApiEducationLevel[] = await levelsRes.json();

    const levelsMap = new Map<string, ApiEducationLevel>();
    levels.forEach((l) => levelsMap.set(l.id, l));

    const articleBooks = articles.map((a) => articleToBook(a, levelsMap));
    const packBooks = packs.map((p) => packToBook(p));

    const combined = [...articleBooks, ...packBooks];
    return combined.length > 0 ? combined : MOCK_BOOKS;
  } catch (error) {
    console.warn('Unable to load catalog from REST API, using fallback data:', error);
    return MOCK_BOOKS;
  }
}
