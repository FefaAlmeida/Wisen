#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."
backup_env="${ENV_FILE:-.env.production}"
backup_dir="${BACKUP_DIR:-$PWD/backups}"
mkdir -p "$backup_dir"
backup_file="$backup_dir/wisen-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
backup_temporary="$(mktemp "$backup_dir/.backup-XXXXXX")"
trap 'rm -f "$backup_temporary"' EXIT
compose_environment=(--env-file "$backup_env")
image_environment="${IMAGE_ENV_FILE:-.images.env}"
if [[ -f "$image_environment" ]]; then compose_environment+=(--env-file "$image_environment"); fi
ENV_FILE="$backup_env" docker compose "${compose_environment[@]}" -f compose.production.yml exec -T database sh -c 'pg_dump --no-owner --no-privileges -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$backup_temporary"
gzip -t "$backup_temporary"
mv "$backup_temporary" "$backup_file"
printf 'Backup criado: %s\n' "$backup_file"
