#!/usr/bin/env bash
# save.sh — run the quality gate; only commit if GREEN, then auto-tag a golden state.
# Usage:  bash save.sh "what you just finished"
# You (a non-coder) only need this + rescue.sh. Never commit broken code.
set -e

MSG="${1:-checkpoint}"

echo "▶ Running quality gate (lint + typecheck + tests + coverage + build)..."
if ! npm run verify; then
  echo ""
  echo "❌ GATE FAILED — NOT saving. The code is broken."
  echo "   Paste the red output above to the AI with the RESCUE prompt in PROMPT_LIBRARY.md."
  exit 1
fi

git add -A
git commit -m "green: $MSG"

# auto-increment stable tag: stable-0, stable-1, ...
last=$(git tag --list 'stable-*' | sed 's/stable-//' | sort -n | tail -1)
next=$(( ${last:--1} + 1 ))
git tag "stable-$next"

echo ""
echo "✅ SAVED and tagged stable-$next  (message: \"$MSG\")"
echo "   If the next AI edit breaks things, run:  bash rescue.sh stable-$next"

