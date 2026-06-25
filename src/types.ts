export type AppView = 'collage' | 'archive' | 'diary' | 'about_me';

export interface ScrapbookElement {
  id: string;
  type: 'photo' | 'text' | 'handwritten' | 'postit' | 'tape' | 'flower' | 'stamp' | 'paperclip' | 'filmstrip';
  content?: string; // Text or Image URL
  title?: string;
  rotation?: number; // e.g. -5 to 5 degrees
  extraClass?: string; // custom styling
  aspectRatio?: string; // e.g. 'aspect-square' or 'aspect-[3/4]'
}

export interface DiaryEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  folderName: string; // e.g., "YOU", "NEED", "JREAMI'S", "freebies?"
  folderTabColor: string; // Tailwind class
  folderBgColor: string; // Tailwind class for folder page
  folderTextColor: string;
  elements: ScrapbookElement[];
}
