#!/bin/sh
set -e

echo "Running database migration..."
npx tsx scripts/migrate.ts 002_session_aspects.sql 2>/dev/null || true

echo "Importing vault data..."
npx tsx scripts/import-all.ts

echo "Starting bot..."
exec node dist/index.js
