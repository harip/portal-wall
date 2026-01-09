export type Category = 'movie' | 'book' | 'link' | 'other';

export interface QuickSaveItem {
  id: string;
  title: string;
  category: Category;
  createdAt: number; // Unix timestamp (Date.now())
}

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'movie', label: 'Movie', emoji: '🎬' },
  { value: 'book', label: 'Book', emoji: '📚' },
  { value: 'link', label: 'Link', emoji: '🔗' },
  { value: 'other', label: 'Other', emoji: '📝' },
];
