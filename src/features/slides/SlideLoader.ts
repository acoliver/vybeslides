import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { SlideEntry, LoadedSlide } from './Types';

export async function loadSlide(baseDir: string, entry: SlideEntry): Promise<LoadedSlide> {
  const filePath = path.join(baseDir, entry.filename);
  const content = await fs.readFile(filePath, 'utf-8');
  
  return {
    filename: entry.filename,
    content,
    beforeTransition: entry.beforeTransition,
    afterTransition: entry.afterTransition,
  };
}

export async function loadSlides(baseDir: string, entries: SlideEntry[]): Promise<LoadedSlide[]> {
  const loadPromises = entries.map((entry) => loadSlide(baseDir, entry));
  return await Promise.all(loadPromises);
}
