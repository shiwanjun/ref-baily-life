CREATE TABLE IF NOT EXISTS ref_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  wechat TEXT DEFAULT '',
  telegram TEXT DEFAULT '',
  crm_uid TEXT DEFAULT '',
  vip_status TEXT NOT NULL DEFAULT 'none',
  vip_started_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_ref_users_email ON ref_users(email);
CREATE INDEX IF NOT EXISTS idx_ref_users_crm_uid ON ref_users(crm_uid);
