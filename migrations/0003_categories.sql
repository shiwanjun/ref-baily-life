CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO categories (name, description, sort_order) VALUES
('返现购物', '购物返利、消费返现', 10),
('银行开户', '银行账户、支票账户、开户奖励', 20),
('信用卡申请', '个人卡、商业卡、团办入口', 30),
('券商与交易所', '券商、股票、加密交易平台', 40),
('支付汇款与钱包', '跨境汇款、支付工具、冷热钱包', 50),
('eSIM 通信与地址', '手机卡、流量、美国地址', 60),
('旅行与理赔', '航班延误、旅行保障', 70),
('数字服务与好物', '会员、AI 工具、实物好物', 80);
