# Contributing

Thanks for improving Oh My MiMo Code.

## Before You Start

- Keep user-facing docs focused on Oh My MiMo Code. Mention the upstream base only where provenance, license, or file layout requires it.
- Keep MiMo-specific compatibility behavior small and explicit.
- Do not add new dependencies unless the change clearly needs them.
- Do not commit generated archives, dependency directories, local runtime state, logs, or secrets.

## Development Setup

Build the plugin first:

```bash
cd oh-my-openagent
bun install
bun run build
```

Install the local launcher and config:

```bash
cd ..
./scripts/install-mimo-wrapper.sh
```

## Verification

Run the focused compatibility checks before opening a pull request.

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

## Pull Request Notes

Include:

- What changed.
- Why the change belongs in this MiMo-focused integration.
- What was tested.
- Any known gaps, especially provider connectivity or runtime smoke-test limits.
