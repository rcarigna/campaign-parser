#!/bin/bash
# Vercel ignore script - skip deployment for docs-only changes

echo "🔍 Checking if build should be skipped..."
echo "📋 Vercel Environment Info:"
echo "  - Previous SHA: ${VERCEL_GIT_PREVIOUS_SHA:-'Not available'}"
echo "  - Current SHA: ${VERCEL_GIT_COMMIT_SHA:-'Not available'}"

# Get the list of changed files since last deploy
if [ -n "$VERCEL_GIT_PREVIOUS_SHA" ]; then
  # Compare against previous deployment - with error handling
  CHANGED_FILES=$(git diff --name-only $VERCEL_GIT_PREVIOUS_SHA $VERCEL_GIT_COMMIT_SHA 2>/dev/null)
  
  # If git diff fails (bad object), fall back to HEAD~1
  if [ $? -ne 0 ] || [ -z "$CHANGED_FILES" ]; then
    echo "⚠️ Previous SHA not found, comparing against HEAD~1"
    CHANGED_FILES=$(git diff --name-only HEAD~1 2>/dev/null)
  fi
else
  # Fallback: compare against HEAD~1
  CHANGED_FILES=$(git diff --name-only HEAD~1 2>/dev/null)
fi

# If we still can't get changed files, assume deployment is needed
if [ -z "$CHANGED_FILES" ]; then
  echo "⚠️ Cannot determine changed files, proceeding with deployment"
  exit 1
fi

echo "📁 Changed files:"
echo "$CHANGED_FILES"

# Files/patterns that should NOT trigger a deployment
DOCS_ONLY_PATTERNS=(
  "^docs/"
  "^README\.md$"
  "^CONTRIBUTING\.md$" 
  "^\.github/"
  "^LICENSE$"
  "^\.gitignore$"
  "^index\.md$"
  "^_config\.yml$"
)

# Files/patterns that SHOULD trigger a deployment (take precedence)
CODE_PATTERNS=(
  "^src/"
  "^app/"
  "^components/"
  "^lib/"
  "^public/"
  "^package\.json$"
  "^package-lock\.json$"
  "^next\.config"
  "^tsconfig"
  "^tailwind\.config"
  "^jest\.config"
  "^vercel\.json$"
)

# Check if any code files changed
code_changed=false
for file in $CHANGED_FILES; do
  for pattern in "${CODE_PATTERNS[@]}"; do
    if echo "$file" | grep -qE "$pattern"; then
      echo "✅ Code file changed: $file"
      code_changed=true
      break
    fi
  done
  if [ "$code_changed" = true ]; then
    break
  fi
done

# If code files changed, always deploy
if [ "$code_changed" = true ]; then
  echo "🚀 Code files changed - proceeding with deployment"
  exit 1  # Exit code 1 = proceed with deployment
fi

# Check if only docs files changed
docs_only_changed=true
for file in $CHANGED_FILES; do
  file_is_docs=false
  for pattern in "${DOCS_ONLY_PATTERNS[@]}"; do
    if echo "$file" | grep -qE "$pattern"; then
      file_is_docs=true
      break
    fi
  done
  
  if [ "$file_is_docs" = false ]; then
    echo "⚠️ Non-docs file changed: $file"
    docs_only_changed=false
  fi
done

if [ "$docs_only_changed" = true ]; then
  echo "📚 Only documentation files changed - skipping deployment"
  echo "🎯 Docs are deployed via GitHub Pages, not Vercel"
  exit 0  # Exit code 0 = skip deployment
else
  echo "🚀 Application files changed - proceeding with deployment" 
  exit 1  # Exit code 1 = proceed with deployment
fi