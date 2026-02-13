#!/bin/sh
set -e

echo "=== Inkfluence AI Docker Entrypoint ==="

# Wait for PostgreSQL to be ready (belt-and-suspenders with docker-compose healthcheck)
echo "Waiting for PostgreSQL..."
until pg_isready -h db -p 5432 -U inkfluence -q; do
  echo "PostgreSQL not ready, retrying in 2s..."
  sleep 2
done
echo "PostgreSQL is ready."

# Push database schema using Drizzle Kit
echo "Pushing database schema..."
pnpm db:push
echo "Database schema pushed successfully."

# Optionally run seed script
if [ "${SEED_DB}" = "true" ]; then
  echo "Seeding database..."
  pnpm db:seed
  echo "Database seeded."
fi

echo "Starting application..."
exec "$@"
