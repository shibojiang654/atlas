create extension if not exists vector;

create table if not exists entries (
  id bigserial primary key,
  user_id text not null,
  title text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id bigserial primary key,
  entry_id bigint not null references entries(id) on delete cascade,
  user_id text not null,
  chunk_index integer not null,
  chunk_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists embeddings (
  id bigserial primary key,
  document_id bigint not null references documents(id) on delete cascade,
  user_id text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_entries_user_id on entries(user_id);
create index if not exists idx_entries_created_at on entries(created_at desc);
create index if not exists idx_documents_user_id on documents(user_id);
create index if not exists idx_documents_created_at on documents(created_at desc);
create index if not exists idx_embeddings_user_id on embeddings(user_id);
create index if not exists idx_embeddings_vector on embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);
