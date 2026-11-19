#!/bin/bash
set -euo pipefail
umask 077
cd /opt/wisen
exec 9>/run/lock/wisen-deploy.lock
flock -n 9 || exit 0
mkdir -p backups/daily
stamp=$(date -u +%Y%m%dT%H%M%SZ)
file="backups/daily/$stamp.dump"
docker compose --env-file .env.production --env-file .images.env -f compose.production.yml exec -T database pg_dump -U wisen -d wisen -Fc > "$file.tmp"
test -s "$file.tmp"
mv "$file.tmp" "$file"
find backups/daily -name '*.dump' -type f -mtime +14 -delete
printf 'Wisen backup completed: %s\n' "$stamp"
