#!/bin/bash
# Restore a custom-format backup into a disposable container, never production.
set -euo pipefail
[[ $# == 1 && -s $1 ]] || { echo 'Usage: bash deploy/restore-check.sh backup.dump' >&2; exit 64; }
name="wisen-restore-check-$$"
trap 'docker rm -f "$name" >/dev/null 2>&1 || true' EXIT
docker run -d --name "$name" --network none --memory 512m -e POSTGRES_USER=wisen -e POSTGRES_DB=wisen -e POSTGRES_HOST_AUTH_METHOD=trust pgvector/pgvector:pg17 >/dev/null
ready=false
for _ in $(seq 1 60); do if docker exec "$name" pg_isready -U wisen >/dev/null 2>&1; then ready=true; break; fi; sleep 1; done
[[ $ready == true ]]
docker exec -i "$name" pg_restore --exit-on-error --no-owner --no-privileges -U wisen -d wisen < "$1"
docker exec "$name" psql -U wisen -d wisen -v ON_ERROR_STOP=1 -c 'SELECT count(*) migrations FROM schema_migrations; SELECT count(*) events FROM events; SELECT count(*) concepts FROM concepts;'
echo 'Isolated backup restore passed'
