-- Cloudflare D1 schema for `sites`
CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  abbrlink TEXT UNIQUE,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  title_zh TEXT,
  title_en TEXT,
  description TEXT,
  desc_zh TEXT,
  desc_en TEXT,
  sub_title TEXT,
  icon TEXT,
  link TEXT,
  permalink TEXT,
  date TEXT,
  isShow INTEGER DEFAULT 1
);

-- Helpful index for random lookups on visible entries
CREATE INDEX IF NOT EXISTS idx_sites_visible ON sites(isShow);
