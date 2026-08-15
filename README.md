# BaselineWQ

Community water quality and habitat research, shared openly.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open http://localhost:3000 in your browser.

The site works immediately with mock data. To connect real data storage, follow the Supabase setup below.

## Connecting Supabase (free)

1. Create a free account at https://supabase.com
2. Create a new project (any name, pick a region near you)
3. Go to Project Settings > API and copy your **Project URL** and **anon public** key
4. Copy `.env.local.example` to `.env.local` and paste your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. In the Supabase dashboard, go to SQL Editor and run this to create the studies table:

```sql
create table studies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  email text,
  location text not null,
  lat numeric,
  lng numeric,
  date_start date,
  date_end date,
  waterbody text,
  category text default 'water-quality',
  parameters text[],
  summary text,
  findings text[],
  lab text,
  methods text,
  sites integer,
  created_at timestamp with time zone default now()
);

-- Enable row-level security
alter table studies enable row level security;

-- Allow anyone to read studies
create policy "Studies are viewable by everyone"
  on studies for select using (true);

-- Allow authenticated users to insert studies
create policy "Authenticated users can insert studies"
  on studies for insert with check (auth.role() = 'authenticated');
```

6. To enable file uploads, go to Storage in Supabase and create a bucket called `reports` with public access.

## Deploying to Vercel (free)

1. Push this project to a GitHub repository
2. Go to https://vercel.com and sign in with GitHub
3. Click "Import Project" and select your repo
4. Add your Supabase environment variables in the Vercel dashboard
5. Click Deploy

Your site will be live at `your-project.vercel.app`. You can add a custom domain later.

## Project Structure

```
baselinewq/
  app/
    layout.js        -- Header, footer, global layout
    page.js          -- Landing page
    globals.css      -- All styles
    explore/page.js  -- Browse studies with map and search
    upload/page.js   -- Submit new research
    study/[id]/page.js -- Individual study detail view
  components/
    StudyCard.js     -- Card component for study listings
    MapView.js       -- Leaflet map with study markers
  lib/
    supabase.js      -- Supabase client (auto-detects if configured)
    mockData.js      -- Sample data for development
```

## Next Steps

After deploying, here are the features to build next:

- Wire up the upload form to insert into Supabase (replace the console.log in upload/page.js)
- Add Supabase Auth for user accounts (email/password or Google sign-in)
- Connect file uploads to Supabase Storage
- Replace mock data queries with Supabase queries on the explore and detail pages
- Add a user profile page showing someone's submitted studies
