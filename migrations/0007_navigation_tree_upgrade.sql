PRAGMA defer_foreign_keys = ON;

ALTER TABLE categories RENAME TO categories_legacy;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order, created_at, updated_at)
SELECT
  id,
  name,
  'legacy-' || id,
  COALESCE(description, ''),
  NULL,
  1,
  COALESCE(sort_order, 100),
  COALESCE(created_at, CURRENT_TIMESTAMP),
  COALESCE(updated_at, CURRENT_TIMESTAMP)
FROM categories_legacy;

DROP TABLE categories_legacy;

ALTER TABLE sites ADD COLUMN category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE sites ADD COLUMN source_site TEXT NOT NULL DEFAULT '';
ALTER TABLE sites ADD COLUMN source_category_path TEXT NOT NULL DEFAULT '';
ALTER TABLE sites ADD COLUMN normalized_domain TEXT NOT NULL DEFAULT '';

UPDATE sites
SET category_id = (
  SELECT id FROM categories WHERE categories.name = sites.category LIMIT 1
)
WHERE category_id IS NULL;

UPDATE sites
SET normalized_domain = lower(
  replace(
    replace(
      replace(
        replace(url, 'https://', ''),
        'http://', ''
      ),
      'www.', ''
    ),
    '/', ''
  )
)
WHERE normalized_domain = '';

CREATE INDEX IF NOT EXISTS idx_categories_parent_sort ON categories(parent_id, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_categories_level_sort ON categories(level, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_sites_category_id ON sites(category_id, featured, hidden, sort_order, id);
CREATE INDEX IF NOT EXISTS idx_sites_domain_url ON sites(normalized_domain, url);
