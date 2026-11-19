#!/bin/sh
set -eu
set -f
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
# No evaluation: only allowlisted operations and a full commit SHA.
# shellcheck disable=SC2086
set -- ${SSH_ORIGINAL_COMMAND:-}
[ "$#" -eq 2 ] || exit 64
case "$1" in deploy|configure|rollback|dry-run) ;; *) exit 64;; esac
printf '%s\n' "$2" | grep -Eq '^[0-9a-f]{40}$' || exit 64
exec doas /usr/local/sbin/deploy-wisen "$1" "$2"
