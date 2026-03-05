export type Entry = {
  id: number;
  title: string | null;
  content_preview: string;
  created_at: string;
};

export type Citation = {
  entryId: number;
  documentId: number;
  createdAt: string;
  snippet: string;
};
