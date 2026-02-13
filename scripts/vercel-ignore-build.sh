#!/bin/bash
# Vercel Ignored Build Step
# Exit 0 = skip build, Exit 1 = proceed with build
# See: https://vercel.com/docs/concepts/projects/overview#ignored-build-step

echo "Checking files changed since last deployment..."

# Get the list of changed files
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")

# If we can't determine changes (first deploy), always build
if [ -z "$CHANGED_FILES" ]; then
  echo "Unable to determine changed files. Proceeding with build."
  exit 1
fi

echo "Changed files:"
echo "$CHANGED_FILES"

# Check if any deployment-relevant files changed
SHOULD_BUILD=false

while IFS= read -r file; do
  case "$file" in
    src/*|public/*|package.json|pnpm-lock.yaml|next.config.*|tailwind.config.*|tsconfig.json|postcss.config.*|components.json)
      echo "Deployment-relevant file changed: $file"
      SHOULD_BUILD=true
      ;;
    scripts/vercel-ignore-build.sh)
      echo "Build script itself changed: $file"
      SHOULD_BUILD=true
      ;;
    docs/*|tests/*|__tests__/*|scripts/*|*.md|.claude/*|docker-compose.yml|Dockerfile|.dockerignore|.env.example|.env.docker|drizzle/*|.github/*|commands/*)
      echo "Non-deployment file changed (skipping): $file"
      ;;
    *.test.*|*.spec.*)
      echo "Test file changed (skipping): $file"
      ;;
    *)
      echo "Unknown file changed, building to be safe: $file"
      SHOULD_BUILD=true
      ;;
  esac
done <<< "$CHANGED_FILES"

if [ "$SHOULD_BUILD" = true ]; then
  echo "Proceeding with build."
  exit 1
else
  echo "No deployment-relevant changes. Skipping build."
  exit 0
fi
