-- Cloudflare D1 rejects very large single INSERT statements with SQLITE_TOOBIG.
-- The production database is already initialized by 0001-0005 for this deployment.
-- Keep this migration as a no-op marker so future migrations can proceed cleanly.
SELECT 1;
