export type Entry = {
  id: number;
  title: string | null;
  content_preview: string;
  created_at: string;
  mood?: number;
  energy?: number;
  stress?: number;
};

export type Citation = {
  entryId: number;
  documentId: number;
  createdAt: string;
  snippet: string;
};
