#!/usr/bin/env bash
set -euo pipefail

HOSTS_FILE=/etc/hosts
LINE_ROOT="127.0.0.1   test.local"
LINE_SUB="127.0.0.1   sub.test.local"

# --- стать root, если ещё не ---
if [[ $EUID -ne 0 ]]; then exec sudo "$0" "$@"; fi

# --- удалить записи ---
if [[ ${1-} == rm ]]; then
  sed -i.bak '/[[:space:]]test\.local$/d' "$HOSTS_FILE"
  sed -i.bak '/[[:space:]]sub\.test\.local$/d' "$HOSTS_FILE"
  echo "Удалено (резервная копия: $HOSTS_FILE.bak)"
  exit 0
fi

# --- добавить, если нет ---
if ! grep -q '[[:space:]]test\.local$'  "$HOSTS_FILE"; then
  printf '%s\n' "$LINE_ROOT" >> "$HOSTS_FILE"
fi
if ! grep -q '[[:space:]]sub\.test\.local$' "$HOSTS_FILE"; then
  printf '%s\n' "$LINE_SUB"  >> "$HOSTS_FILE"
fi

cat "$HOSTS_FILE"

echo "hosts обновлён"
