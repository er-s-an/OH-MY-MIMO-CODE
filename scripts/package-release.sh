#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
version="${1:-$(date +%Y%m%d)}"
package_name="oh-my-mimo-code-$version"
out_dir="$repo_root/release"
staging="$out_dir/$package_name"

rm -rf "$staging"
mkdir -p "$staging"

copy_path() {
  local path="$1"
  if [[ -e "$repo_root/$path" ]]; then
    mkdir -p "$staging/$(dirname "$path")"
    cp -R "$repo_root/$path" "$staging/$path"
  fi
}

for path in \
  README.md \
  LICENSE \
  LICENSES.md \
  SECURITY.md \
  CONTRIBUTING.md \
  PUBLISHING.md \
  OPEN_SOURCE_CHECKLIST.md \
  .gitignore \
  .gitattributes \
  config \
  prompts \
  scripts \
  patches \
  oh-my-openagent
do
  copy_path "$path"
done

find "$staging" \( \
  -name node_modules -o \
  -name dist -o \
  -name .omo -o \
  -name .omx -o \
  -name .mimocode -o \
  -name .git -o \
  -name .github -o \
  -name .codegraph -o \
  -name .cache -o \
  -name .dev-home \
\) -prune -exec rm -rf {} +

find "$staging" \( \
  -name '*.tar.gz' -o \
  -name '*.tgz' -o \
  -name '*.zip' -o \
  -name '*.log' -o \
  -name '.env' -o \
  -name '.env.*' \
\) -type f -delete

tar -czf "$out_dir/$package_name.tar.gz" -C "$out_dir" "$package_name"
echo "Created $out_dir/$package_name.tar.gz"
