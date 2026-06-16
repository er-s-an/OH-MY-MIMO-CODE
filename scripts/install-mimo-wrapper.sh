#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bin_dir="${MIMO_BIN_DIR:-$HOME/bin}"
config_dir="${MIMOCODE_CONFIG_DIR:-$HOME/.config/mimocode}"
wrapper_path="$bin_dir/mimo"
plugin_path="$repo_root/oh-my-openagent/dist/index.js"
mimocode_source_dir="${MIMOCODE_SOURCE_DIR:-$repo_root/MiMo-Code/packages/opencode}"

if [[ ! -x "$HOME/.bun/bin/bun" ]] && ! command -v bun >/dev/null 2>&1; then
  echo "Missing bun. Install Bun first: https://bun.sh"
  exit 1
fi

bun_bin="$(command -v bun || true)"
if [[ -x "$HOME/.bun/bin/bun" ]]; then
  bun_bin="$HOME/.bun/bin/bun"
fi

if [[ ! -f "$plugin_path" ]]; then
  echo "Missing OMO plugin build: $plugin_path"
  echo "Run this first:"
  echo "  cd \"$repo_root/oh-my-openagent\""
  echo "  bun install"
  echo "  bun run build"
  exit 1
fi

if [[ ! -f "$mimocode_source_dir/src/index.ts" ]]; then
  echo "Missing MiMo-Code source directory: $mimocode_source_dir"
  echo "Set MIMOCODE_SOURCE_DIR to your local MiMo-Code packages/opencode directory:"
  echo "  MIMOCODE_SOURCE_DIR=/absolute/path/to/MiMo-Code/packages/opencode ./scripts/install-mimo-wrapper.sh"
  echo
  echo "If you use the optional compatibility patch, apply it in your MiMo-Code checkout:"
  echo "  cd /absolute/path/to/MiMo-Code"
  echo "  patch -p1 < /absolute/path/to/oh-my-mimo-code/patches/mimocode-agent-aliases.patch"
  exit 1
fi

mkdir -p "$bin_dir" "$config_dir"

backup_if_exists() {
  local path="$1"
  if [[ -e "$path" ]]; then
    local backup="$path.bak.$(date +%Y%m%d%H%M%S)"
    cp "$path" "$backup"
    echo "Backed up existing file: $backup"
  fi
}

backup_if_exists "$wrapper_path"
backup_if_exists "$config_dir/mimocode.jsonc"
backup_if_exists "$config_dir/oh-my-openagent.jsonc"

cat > "$wrapper_path" <<EOF
#!/usr/bin/env bash
set -euo pipefail

original_pwd="\$PWD"

export PATH="$HOME/.bun/bin:\$PATH"
export MIMOCODE_DISABLE_AUTOUPDATE="\${MIMOCODE_DISABLE_AUTOUPDATE:-1}"
export MIMOCODE_DISABLE_MODELS_FETCH="\${MIMOCODE_DISABLE_MODELS_FETCH:-1}"
export MIMOCODE_ENABLE_ANALYSIS="\${MIMOCODE_ENABLE_ANALYSIS:-false}"

if [[ "\$#" -eq 0 ]]; then
  set -- "\$original_pwd"
elif [[ "\${1:-}" == "run" ]]; then
  has_dir=0
  for arg in "\$@"; do
    if [[ "\$arg" == "--dir" ]]; then
      has_dir=1
      break
    fi
  done
  if [[ "\$has_dir" -eq 0 ]]; then
    set -- "\$@" --dir "\$original_pwd"
  fi
fi

cd "$mimocode_source_dir"
exec "$bun_bin" --conditions=browser src/index.ts "\$@"
EOF

chmod +x "$wrapper_path"

cat > "$config_dir/mimocode.jsonc" <<EOF
{
  "plugin": [
    "file://$plugin_path"
  ],
  "autoupdate": false,
  "dream": {
    "auto": false
  },
  "distill": {
    "auto": false
  }
}
EOF

cat > "$config_dir/oh-my-openagent.jsonc" <<'EOF'
{
  "agents": {
    "sisyphus": {
      "model": "mimo/mimo-auto"
    }
  }
}
EOF

echo "Installed MiMo wrapper: $wrapper_path"
echo "Using MiMo-Code source: $mimocode_source_dir"
echo "Wrote MiMo config: $config_dir/mimocode.jsonc"
echo "Wrote OMO config: $config_dir/oh-my-openagent.jsonc"
echo
echo "Make sure this directory is on PATH:"
echo "  $bin_dir"
echo
echo "Try:"
echo "  mimo --help"
echo "  mimo"
