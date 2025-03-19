#!/bin/bash

# Fetch the latest version from Amazon ECR
repository_name="prod-znnxt-fe-admin"
latest_tag=$(aws ecr describe-images --repository-name $repository_name --query 'sort_by(imageDetails,& imagePushedAt)[-1].imageTags[0]' --output text)
if [ -z "$latest_tag" ] || [ "$latest_tag" = "None" ]; then
  latest_tag="v0.0.0"
fi
echo "Latest tag from Amazon ECR: $latest_tag"

# Extract and increment version
current_version=${latest_tag#v}
echo "Current version from Amazon ECR: $latest_tag"
echo "Current version: $current_version"

if [ "$current_version" = "null" ] || [ -z "$current_version" ]; then
  current_version="0.0.0"
fi

IFS='.' read -r major minor patch <<< "$current_version"

# Determine the type of change
if git rev-parse "v${latest_tag#v}" >/dev/null 2>&1; then
  commits=$(git log --oneline $(git describe --tags --abbrev=0)..HEAD)
else
  commits=$(git log --oneline)
fi
echo "Commits=$commits"

increment_major=false
increment_minor=false
increment_patch=false

if echo "$commits" | grep -q "ma:"; then
  increment_major=true
fi
if echo "$commits" | grep -q "mi:"; then
  increment_minor=true
fi
if echo "$commits" | grep -q "pa:"; then
  increment_patch=true
fi

if [ "$increment_major" = true ]; then
  major=$((major + 1))
  minor=0
  patch=0
elif [ "$increment_minor" = true ]; then
  minor=$((minor + 1))
  patch=0
elif [ "$increment_patch" = true ]; then
  patch=$((patch + 1))
fi

NEW_TAG="v$major.$minor.$patch"
# echo "New version: $new_version"
# echo "new_version=$new_version" >> $GITHUB_ENV
echo ::set-output name=git-tag::$NEW_TAG