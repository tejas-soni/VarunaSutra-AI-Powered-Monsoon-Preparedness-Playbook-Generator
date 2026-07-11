#!/usr/bin/env bash
# rescue.sh — undo AI damage instantly. Your panic button.
# Usage:
#   bash rescue.sh              → discard ALL uncommitted changes (back to last save)
#   bash rescue.sh stable-2     → jump all the way back to golden tag stable-2
set -e

if [ -n "$1" ]; then
  echo "⏪ Resetting HARD to $1 ..."
  git reset --hard "$1"
  git clean -fd            # remove new files the AI added (ignored files like node_modules are kept)
  echo "✅ Back at $1. Re-prompt the AI with a TIGHTER scope (one file/function)."
else
  echo "⏪ Discarding all uncommitted changes (back to last commit)..."
  git checkout .
  git clean -fd
  echo "✅ Restored to last saved state. Re-prompt with a tighter scope."
fi

echo ""
echo "Available golden tags:"
git tag --list 'stable-*' | sort -V

