#!/bin/sh

# Setup script to install Git hooks

echo "📦 Setting up Git hooks..."
echo ""

# Install pre-push hook
HOOK_SOURCE="scripts/pre-push"
HOOK_TARGET=".git/hooks/pre-push"

if [ -f "$HOOK_TARGET" ]; then
  echo "⚠️  Pre-push hook already exists."
  echo "Backing up existing hook to $HOOK_TARGET.backup"
  cp "$HOOK_TARGET" "$HOOK_TARGET.backup"
fi

echo "Installing pre-push hook..."
cp "$HOOK_SOURCE" "$HOOK_TARGET"
chmod +x "$HOOK_TARGET"

echo ""
echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-push hook will now run lint and TypeScript checks before each push."
echo "This helps prevent pushing code that would fail CI checks."
echo ""
