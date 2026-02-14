export interface BookMetadataGenerationResult {
  description: string;
  keywords: string[];
  category: string;
}

export interface PrePublishChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  actionPath?: string;
}

export interface PrePublishChecklist {
  items: PrePublishChecklistItem[];
  allComplete: boolean;
}

export const EBOOK_CATEGORIES = [
  "Business & Money",
  "Self-Help",
  "Health & Fitness",
  "Technology",
  "Education & Teaching",
  "Science & Nature",
  "Arts & Photography",
  "Biographies & Memoirs",
  "Cooking & Food",
  "History",
  "Religion & Spirituality",
  "Travel",
  "Parenting & Relationships",
  "Politics & Social Sciences",
  "Other",
] as const;

export type EbookCategory = (typeof EBOOK_CATEGORIES)[number];
