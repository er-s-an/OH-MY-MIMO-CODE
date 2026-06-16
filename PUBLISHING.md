# Publishing Guide

This is the maintainer checklist for preparing a public release.

## Repository Shape

1. Choose the final repository name and owner.
2. Publish the Oh My MiMo Code adaptation layer, not the full local `MiMo-Code/` checkout.
3. Keep `MiMo-Code/` as a development/test dependency or provide a separate upstream fork/patch branch.
4. Start from a clean tree. Do not publish local recovery archives or generated runtime state.
5. Keep upstream license files inside `oh-my-openagent/`.
6. Keep the root `LICENSE` for root-level glue files, docs, templates, patches, and scripts only.

## Files To Exclude

Do not publish:

- `MiMo-Code/`
- `mimo-code.tar.gz`
- `omo.tar.gz`
- `node_modules/`
- `dist/`
- `.omo/`
- `.omx/`
- `.mimocode/`
- `.dev-home/`
- `.cache/`
- `.github/` inherited from upstream projects, unless intentionally reviewed and restored
- `.codegraph/`
- `.env` or `.env.*`
- logs, traces, local session databases, screenshots with private data

The root `.gitignore` is prepared for these, but still inspect the first commit manually.

## Clean-Clone Smoke Test

From a fresh clone:

```bash
cd oh-my-openagent
bun install
bun run build
cd ..
MIMOCODE_SOURCE_DIR=/absolute/path/to/MiMo-Code/packages/opencode \
  ./scripts/install-mimo-wrapper.sh
mimo --help
mimo
```

If the target MiMo-Code checkout does not already resolve legacy agent keys to pinyin display names, apply:

```bash
cd /absolute/path/to/MiMo-Code
patch -p1 < /absolute/path/to/oh-my-mimo-code/patches/mimocode-agent-aliases.patch
```

Expected local evidence:

- `mimo --help` starts from the external MiMo-Code source tree.
- `mimo` opens the interactive TUI.
- MiMo-Code loads the built plugin.
- `/agent` shows `Yugong - ultraworker` when the compatibility patch is needed and applied.

If the MiMo hosted service returns `ConnectionRefused`, separate that from plugin load and agent resolution. It is a provider connectivity issue, not automatically a packaging failure.

## Security Review

Run:

```bash
rg -n --hidden \
  --glob '!**/node_modules/**' \
  --glob '!**/dist/**' \
  --glob '!**/.git/**' \
  --glob '!**/.omo/**' \
  --glob '!**/.omx/**' \
  --glob '!**/.mimocode/**' \
  --glob '!*.tar.gz' \
  '(OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|NPM_TOKEN|SECRET|PRIVATE KEY|sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,}|/Users/)' .
```

Review all hits. Environment variable names in source or docs are usually fine; real values, local paths, session logs, and private endpoints are not.

## GitHub Settings

Before enabling Actions:

- Restore and review inherited workflows only if this release intentionally uses them.
- Disable publish workflows until package ownership and tokens are intentionally configured.
- Add a private security contact in `SECURITY.md`.
- Review trademark wording for MiMo, Xiaomi, OpenCode, and Oh My OpenAgent.
