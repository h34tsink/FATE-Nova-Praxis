#!/bin/sh
set -e

echo "Running database migration..."
node dist/scripts/migrate.js 002_session_aspects.sql 2>/dev/null || true

echo "Importing vault data..."
node dist/scripts/import-all.js

echo "Starting bot..."
exec node dist/index.js
