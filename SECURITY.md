# Security

## Supported Scope

This repository is an integration workspace for Oh My MiMo Code, a MiMo-Code-focused adaptation based on Oh My OpenAgent.

Security-sensitive areas include:

- Provider authentication and MiMo hosted-service credentials.
- Plugin loading from local or file URL paths.
- Agent permission rules and tool-schema exposure.
- Background task, team, and nested delegation controls.
- Runtime state under `.mimocode/`, `.omo/`, `.omx/`, and user config directories.

## Reporting

Do not open a public issue containing credentials, tokens, private endpoint URLs, session databases, or exploit details.

Use GitHub private vulnerability reporting for this repository when available. If it is not enabled yet, contact the repository owner privately before sharing credentials, exploit details, or private logs.

## Secret Handling

Do not commit:

- `.env` or `.env.*` files, except `.env.example`.
- MiMo, OpenAI, Anthropic, GitHub, npm, Stripe, AWS, Slack, or Xiaomi tokens.
- Local runtime state from `.mimocode/`, `.omo/`, `.omx/`, `.dev-home/`, or `~/.config/mimocode`.
- Session databases, logs, traces, screenshots, or tool outputs that may contain prompts or code.

## Pre-Publish Security Checks

Run a secret scan before every public push:

```bash
rg -n --hidden --glob '!**/node_modules/**' --glob '!**/dist/**' \
  --glob '!**/.git/**' --glob '!**/.omo/**' --glob '!**/.omx/**' --glob '!**/.mimocode/**' \
  --glob '!*.tar.gz' \
  '(OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|NPM_TOKEN|SECRET|PRIVATE KEY|sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,})' .
```

Treat matches in tests and docs as review-required, even when they appear to be fake examples.
