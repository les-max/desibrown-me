-- Posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  body text default '',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Photos (one post can have many)
create table photos (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  storage_path text not null,
  order_index int default 0,
  created_at timestamptz default now()
);

-- RLS
alter table posts enable row level security;
alter table photos enable row level security;

create policy "Public can read published posts"
  on posts for select
  using (published = true);

create policy "Authenticated users can manage posts"
  on posts for all
  using (auth.role() = 'authenticated');

create policy "Public can read photos for published posts"
  on photos for select
  using (
    exists (
      select 1 from posts
      where posts.id = photos.post_id
      and posts.published = true
    )
  );

create policy "Authenticated users can manage photos"
  on photos for all
  using (auth.role() = 'authenticated');

-- Storage bucket (run in Supabase SQL editor or Storage dashboard)
-- Create a bucket named "post-photos" with public access enabled
