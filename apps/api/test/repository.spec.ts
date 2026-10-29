import * as fs from 'fs';
import * as path from 'path';
import { JsonArticleRepository, JsonEducationLevelRepository } from '../src/repositories/json/json-repositories';

describe('Repository Parity & Integrity Tests', () => {
  const testDataDir = path.resolve(__dirname, 'tmp-repo-data');

  beforeAll(() => {
    process.env.DATA_DIR = testDataDir;
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

  it('should create and retrieve education levels correctly in JSON storage', async () => {
    const edRepo = new JsonEducationLevelRepository();

    const created = await edRepo.create({
      code: 'TEST_PRIM',
      name: { ar: 'ابتدائي تجريبي', fr: 'Primaire Test', en: 'Primary Test' },
      category: 'primary',
      displayOrder: 1,
      active: true,
    });

    expect(created.id).toBeDefined();
    expect(created.code).toBe('TEST_PRIM');

    const found = await edRepo.findById(created.id);
    expect(found).not.toBeNull();
    expect(found?.name.ar).toBe('ابتدائي تجريبي');

    const all = await edRepo.findAll();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });

  it('should create, search, and update articles correctly in JSON storage', async () => {
    const edRepo = new JsonEducationLevelRepository();
    const artRepo = new JsonArticleRepository();

    const level = await edRepo.create({
      code: 'TEST_MID',
      name: { ar: 'إعدادي تجريبي' },
      category: 'middle',
      displayOrder: 2,
      active: true,
    });

    const article = await artRepo.create({
      sku: 'TEST-MATH-01',
      name: { ar: 'كتاب الرياضيات التجريبي', fr: 'Livre Math Test' },
      price: 25.0,
      discountPrice: 20.0,
      educationLevelId: level.id,
      active: true,
    });

    expect(article.id).toBeDefined();
    expect(article.price).toBe(25.0);

    const searchResults = await artRepo.findAll({ search: 'الرياضيات' });
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].sku).toBe('TEST-MATH-01');

    const updated = await artRepo.update(article.id, { price: 22.0 });
    expect(updated?.price).toBe(22.0);
  });
});
