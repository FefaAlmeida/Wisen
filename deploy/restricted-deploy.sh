#!/bin/bash
set -euo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
umask 077
[[ $(id -u) == 0 && $# == 2 ]] || exit 64
operation=$1
release=$2
[[ $operation =~ ^(deploy|configure|rollback|dry-run)$ && $release =~ ^[0-9a-f]{40}$ ]] || exit 64
cd /opt/wisen
for entry in /opt /opt/wisen /opt/wisen/compose.production.yml; do
 [[ ! -L $entry && $(stat -c %u "$entry") == 0 && $(stat -c %a "$entry") =~ ^[4567][0145][0145]$ ]] || exit 1
done
[[ $operation != dry-run ]] || { echo 'Validated Wisen deployment'; exit 0; }
exec 9>/run/lock/wisen-deploy.lock
flock -n 9 || { echo 'Another deployment is running' >&2; exit 1; }
export DOCKER_CONFIG
DOCKER_CONFIG=$(mktemp -d /root/.wisen-registry.XXXXXX)
trap 'rm -rf -- "$DOCKER_CONFIG"' EXIT
/usr/local/lib/wisen/receive-config.py
compose=(docker compose --env-file .env.production -f compose.production.yml)
mkdir -p releases backups/predeploy
if [[ $operation == rollback || $operation == configure ]]; then
 [[ -f releases/$release.env ]] || { echo 'Release not deployed on this host' >&2; exit 1; }
 cp "releases/$release.env" .images.next
else
 : > .images.next
 for service in frontend backend ai; do
  image="ghcr.io/fefaalmeida/wisen/$service:sha-$release"
  docker pull "$image" >/dev/null
  digest=$(docker image inspect "$image" --format '{{index .RepoDigests 0}}')
  [[ $digest =~ ^ghcr.io/fefaalmeida/wisen/$service@sha256:[0-9a-f]{64}$ ]] || exit 1
  printf 'WISEN_%s_IMAGE=%s\n' "${service^^}" "$digest" >> .images.next
 done
fi
set -a
source .images.next
set +a
"${compose[@]}" up -d --wait database
"${compose[@]}" stop frontend ai backend
stamp=$(date -u +%Y%m%dT%H%M%SZ)
"${compose[@]}" exec -T database pg_dump -U wisen -d wisen -Fc > "backups/predeploy/$stamp.dump"
test -s "backups/predeploy/$stamp.dump"
if [[ $operation != rollback ]]; then
 "${compose[@]}" run --rm -T migrate
 "${compose[@]}" run --rm --no-deps -T bootstrap
 "${compose[@]}" run --rm --no-deps -T prepare-model
fi
"${compose[@]}" up -d --wait --wait-timeout 240 backend ai frontend
[[ ! -f .images.env ]] || cp .images.env .images.previous.env
cp .images.next "releases/$release.env"
mv .images.next .images.env
printf '%s\n' "$release" > .release
find backups/predeploy -name '*.dump' -mtime +7 -type f ! -name "$(ls -t backups/predeploy | head -1)" -delete
printf 'Healthy Wisen release: %s\n' "$release"
