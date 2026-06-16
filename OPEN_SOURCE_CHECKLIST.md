# Open Source Checklist

## Current Status

- [x] Identified source roots: publish `oh-my-openagent/` plus root glue; keep `MiMo-Code/` as development/test checkout only.
- [x] Confirmed the workspace root is not currently a git repository.
- [x] Added root `.gitignore` for local state, build output, dependencies, secrets, and archive snapshots.
- [x] Added root `.gitattributes` to keep generated release archives clean.
- [x] Added root README describing the integration, commands, agent roles, setup flow, and verification commands.
- [x] Added license boundary documentation.
- [x] Added root MIT `LICENSE` for root-level glue files, docs, templates, and scripts.
- [x] Added security guidance.
- [x] Added `CONTRIBUTING.md`.
- [x] Added `PUBLISHING.md`.
- [x] Added reusable config examples under `config/`.
- [x] Added MiMo Code-guided setup prompt under `prompts/`.
- [x] Added `scripts/install-mimo-wrapper.sh` for external users to install the local `mimo` launcher and config.
- [x] Added `patches/mimocode-agent-aliases.patch` for external MiMo-Code checkouts that need legacy-key alias support.
- [x] Added `scripts/package-release.sh` to create an OMM-only release archive.
- [x] Ran an initial text secret scan; hits reviewed as environment variable names, CI secret placeholders, or test fixtures.
- [x] Identified large local archives that should not be published: `mimo-code.tar.gz`, `omo.tar.gz`.
- [x] Verified OMO package typecheck: `bun run typecheck:packages`.
- [x] Verified OMO focused compatibility tests: 111 pass.
- [x] Verified OMO build: `bun run build`.
- [x] Verified MiMo-Code opencode package typecheck: `bun run typecheck`.
- [x] Verified MiMo-Code agent tests: 44 pass.
- [x] Verified `scripts/install-mimo-wrapper.sh` syntax with `bash -n`.
- [x] Verified `scripts/install-mimo-wrapper.sh` installs into a temporary HOME/config/bin directory.
- [x] Verified the temporary installed `mimo --help` starts successfully.

## Required Before First Public Push

- [ ] Decide final repository name and owner.
- [x] Decide whether to publish this as a combined integration workspace or as two separate forks/patch branches: publish OMM adaptation layer only, not the full MiMo-Code checkout.
- [ ] Initialize git from a clean tree or copy only source directories into a clean repo.
- [ ] Exclude `MiMo-Code/`, `node_modules/`, `dist/`, `.omo/`, `.omx/`, `.mimocode/`, and archive snapshots from the first commit.
- [x] Run `scripts/install-mimo-wrapper.sh` from a temporary user-style HOME/config/bin directory.
- [ ] Re-run `scripts/install-mimo-wrapper.sh` from a clean clone before the final public push.
- [x] Exclude inherited `.github/` workflow directories from the generated release archive by default.
- [ ] Restore and review any `.github/workflows/*` only if Actions are intentionally enabled in a public repository.
- [ ] Review telemetry defaults in both subprojects and document opt-out behavior.
- [ ] Review trademark wording for `MiMo`, `Xiaomi`, `OpenCode`, and `Oh My OpenAgent`.
- [ ] Add public security contact details to `SECURITY.md`.
- [ ] Run the verification commands below from a clean checkout.

## Verification Commands

From `oh-my-openagent/`:

```bash
bun run typecheck:packages
bun run build
bun test packages/omo-opencode/src/shared/agent-display-names.test.ts \
  packages/omo-opencode/src/shared/agent-sort-shim.test.ts \
  packages/omo-opencode/src/shared/agent-config-integration.test.ts \
  packages/omo-opencode/src/plugin-handlers/config-handler.test.ts
```

From `MiMo-Code/packages/opencode/`:

```bash
bun run typecheck
bun test test/agent/agent.test.ts
```

Runtime smoke:

```bash
mimo
```

Expected smoke evidence:

- OMO plugin loads from `oh-my-openagent/dist/index.js`.
- TUI opens successfully.
- `/agent` shows `Yugong - ultraworker` when the compatibility patch is needed and applied.
- `/model` can use `mimo/mimo-auto` or the configured model routes.

MiMo hosted-service failures such as `ConnectionRefused` from `api.xiaomimimo.com` are tracked separately from plugin load and agent resolution.
