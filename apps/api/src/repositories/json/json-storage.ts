import * as fs from 'fs';
import * as path from 'path';

export class JsonStorage<T extends { id: string }> {
  private filePath: string;

  constructor(filename: string) {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, filename);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  async readAll(): Promise<T[]> {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  async writeAll(items: T[]): Promise<void> {
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.readAll();
    return items.find((item) => item.id === id) || null;
  }

  async create(item: T): Promise<T> {
    const items = await this.readAll();
    items.push(item);
    await this.writeAll(items);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    await this.writeAll(items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    await this.writeAll(filtered);
    return true;
  }
}
