# Oh My MiMo Code

**English | [简体中文](README.zh-CN.md)**

OpenCode-style multi-agent workflows for **MiMo Code**.

Oh My MiMo Code is a MiMo-Code plugin and agent workflow adapter. It is based on the ideas behind Oh My OpenAgent, but it is not a blind copy: MiMo Code is built on OpenCode, yet OpenCode plugins are not directly compatible with MiMo Code. This project adapts the agent workflow, model routing, commands, and prompt design for the MiMo Code harness.

You still use the familiar `mimo` interactive TUI. OMM changes what sits behind it: role-based agents, workflow keywords, model routing, lightweight system prompts, and configuration templates.

## Why This Exists

MiMo Code is getting attention fast, but there is a practical gap:

- MiMo Code is based on OpenCode.
- OpenCode plugin workflows do not run in MiMo Code as-is.
- Heavy system prompts and large tool schemas can stress the MiMo Code harness.
- Complex coding tasks need planning, execution, critique, search, and verification as separate behaviors.

Oh My MiMo Code fills that gap by adapting a stronger agent workflow layer specifically for MiMo Code.

## What You Get

| Capability | What it means |
| --- | --- |
| MiMo TUI enhancement | Keep using `mimo`; no strange new CLI entry point. |
| Multi-agent roles | Main worker, deep executor, planner, critic, librarian, code explorer, and more. |
| Workflow keywords | Use `ultrawork`, `ulw`, `team`, `hyperplan`, `analyze`, and similar prompts inside the TUI. |
| Model routing | Assign different models to different agents, with optional fallbacks. |
| Lightweight MiMo harness prompts | Reduce oversized system prompt and tool-schema pressure. |
| Chinese mythology naming | User-facing role names are friendlier, while runtime names stay ASCII-compatible. |
| Compatibility templates | Plugin and agent/model config templates for MiMo Code. |
| MiMo alias patch | Optional compatibility patch for MiMo-Code checkouts that do not resolve the new agent aliases yet. |

## Core Ideas

| Area | Description |
| --- | --- |
| Autonomous main agent | `Yugong - ultraworker` keeps pushing toward the goal, edits code, and verifies results. |
| Deep execution | `Luban - Deep Agent` is for cross-file implementation, complex fixes, and repository exploration. |
| Planning and critique | `Fuxi` builds plans; `Xiezhi` challenges weak assumptions and missing tests. |
| Research and code lookup | `librarian` is for external docs; `explore` is for local code search and call-path mapping. |
| Model routing | Use stable models for main work, stronger coding models for deep execution, and faster models for search. |
| Context slimming | The default MiMo path avoids pushing every heavy delegation tool into the main agent prompt. |

## Quick Start

The easiest path is to give this repository URL to MiMo Code and ask it to install OMM using [prompts/setup-with-mimo-code.md](prompts/setup-with-mimo-code.md).

It is the agent era, after all. You probably do not want to install an agent plugin by hand if the agent can do it for you.

You can say:

```text
Open this GitHub repository and follow prompts/setup-with-mimo-code.md to install and initialize Oh My MiMo Code:
<paste the OMM GitHub URL here>
```

MiMo Code should clone, build, install the wrapper, write config files, and verify the installation. The default model is `mimo/mimo-auto`; MiMo Code only needs to ask more questions if you want different agents to use different providers or models.

Manual installation:

```bash
cd oh-my-openagent
bun install
bun run build
cd ..
MIMOCODE_SOURCE_DIR=/absolute/path/to/MiMo-Code/packages/opencode \
  ./scripts/install-mimo-wrapper.sh
```

The installer:

- Creates a `~/bin/mimo` launcher.
- Writes `~/.config/mimocode/mimocode.jsonc` so MiMo Code loads this plugin.
- Writes `~/.config/mimocode/oh-my-openagent.jsonc` with the default `mimo/mimo-auto` agent model.
- Backs up existing config files before replacing them.

If your MiMo-Code checkout does not resolve aliases such as `sisyphus -> Yugong`, apply the compatibility patch:

```bash
cd /absolute/path/to/MiMo-Code
patch -p1 < /absolute/path/to/oh-my-mimo-code/patches/mimocode-agent-aliases.patch
```

Make sure `~/bin` is in your shell `PATH`:

```bash
export PATH="$HOME/bin:$PATH"
```

Then open the normal MiMo Code TUI:

```bash
mimo
```

Inside the TUI, switch to `Yugong - ultraworker` from `/agent` if needed.

## Model Configuration

The recommended setup flow is not to hand-edit JSON from scratch. Give the repository link to MiMo Code, let it read [prompts/setup-with-mimo-code.md](prompts/setup-with-mimo-code.md), and let it ask what providers/models you have.

If you are unsure, keep the default:

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "mimo/mimo-auto"
    }
  }
}
```

Advanced example:

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "mimo/mimo-auto"
    },
    "hephaestus": {
      "model": "openai/gpt-5.5",
      "variant": "high"
    },
    "librarian": {
      "model": "google/gemini-3-flash"
    },
    "explore": {
      "model": "github-copilot/grok-code-fast-1"
    }
  }
}
```

Fallback models are supported:

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "mimo/mimo-auto",
      "fallback_models": [
        "openai/gpt-5.5",
        { "model": "google/gemini-3-pro", "variant": "high" }
      ]
    }
  }
}
```

## Common TUI Entries

| Entry | Purpose |
| --- | --- |
| `mimo` | Open the MiMo Code interactive TUI. |
| `mimo /path/to/project` | Open the TUI in a specific project directory. |
| `/agent` | Switch agents. The default main agent is `Yugong - ultraworker`. |
| `/model` | Switch models. Default config uses `mimo/mimo-auto`. |
| `/goal` | Define a completion target for long-running tasks. |
| `/dream` | Distill reusable memory from recent sessions. |
| `/distill` | Turn repeated workflows into skills, subagents, or commands. |
| `/voice` | Voice input, depending on MiMo login and runtime support. |

## OMM Workflow Keywords

These are not shell commands. Open `mimo`, then send them as normal messages to the agent.

| Keyword | Use it when | What it does |
| --- | --- | --- |
| `ultrawork` / `ulw` | You want high-intensity progress without manually splitting the task. | Clarifies acceptance criteria, separates exploration/implementation/verification, and keeps pushing. |
| `team` | The task can be split across multiple lanes. | Uses a team-mode style coordination pattern when the current MiMo Code runtime supports it. |
| `hyperplan` | You have a plan but want it challenged first. | Runs critical planning views to find hidden constraints, risks, and missing tests. |
| `search` | The task needs external docs or community references. | Routes toward research instead of guessing from memory. |
| `analyze` | You need the project mapped before edits. | Reads the codebase first, then reports structure and likely change points. |

## Slash Commands

| Command | Use it when | What it does |
| --- | --- | --- |
| `/init-deep` | A project is new or deeply nested. | Builds layered `AGENTS.md` project context. |
| `/start-work [plan-name]` | You already have a plan. | Starts execution from a planning artifact. |
| `/ralph-loop "goal"` | A long task should keep moving. | Runs a persistent completion loop until done, capped, or cancelled. |
| `/ulw-loop "goal"` | You want looped progress plus ultrawork intensity. | Combines Ralph-style continuation with ultrawork-style parallelism. |
| `/cancel-ralph` | A Ralph/ulw loop is going the wrong way. | Cancels the active loop. |
| `/stop-continuation` | You do not want continuation systems taking over. | Stops continuation mechanisms. |
| `/handoff` | You need to continue in another session. | Generates a compact handoff with status, files, and next steps. |
| `/refactor <target>` | You want structured refactoring. | Uses code intelligence, architecture review, and tests where available. |
| `/remove-deadcode` | You want unused code removed carefully. | Combines static scans and reference checks before deletion. |
| `/security-research` | You want security-focused review. | Checks for injection, auth, config leaks, and other risk classes. |
| `/get-unpublished-changes` | You are preparing a release. | Compares published versions against current HEAD and summarizes impact. |
| `/publish <patch\|minor\|major>` | You maintain the package release. | Runs release checks and validates GitHub/npm results. |
| `/omomomo` | You want the small easter egg. | Prints the inherited project easter egg. |

## Agents

The project keeps legacy configuration keys, but the main display names use Chinese mythology / legend-inspired names. Runtime names stay ASCII because agent names may enter HTTP headers.

| Config key | Chinese name | Display name | Best for |
| --- | --- | --- | --- |
| `sisyphus` | 愚公 | `Yugong - ultraworker` | Default main worker: understand, edit, verify, and keep moving. |
| `hephaestus` | 鲁班 | `Luban - Deep Agent` | Deep implementation and cross-file changes. |
| `prometheus` | 伏羲 | `Fuxi - Plan Builder` | Requirement clarification and planning. |
| `atlas` | 大禹 | `Dayu - Plan Executor` | Executing existing plans, TODOs, PRDs, or test specs. |
| `sisyphus-junior` | 小愚公 | `Xiao-Yugong` | Small, focused execution tasks. |
| `metis` | 九天玄女 | `Jiutian-Xuannu - Plan Consultant` | Finding hidden constraints and plan gaps. |
| `momus` | 獬豸 | `Xiezhi - Plan Critic` | Challenging vague requirements, logic issues, and missing tests. |
| `athena` | 西王母 | `Xiwangmu - Council` | Multi-perspective review and major decision checks. |
| `athena-junior` | 小西王母 | `Xiwangmu-Junior - Council` | Lighter review for smaller scopes. |
| `oracle` | 神谕 | `oracle` | Architecture, diagnostics, and hard problems. |
| `librarian` | 藏书官 | `librarian` | External docs, API references, and community research. |
| `explore` | 探路者 | `explore` | Local code search, file lookup, and call-path mapping. |
| `multimodal-looker` | 观象者 | `multimodal-looker` | Image, screenshot, and visual material analysis. |

## Choosing an Agent

| Situation | Recommended agent |
| --- | --- |
| I just want it to finish the task | `sisyphus` / `Yugong - ultraworker` |
| The codebase needs deep exploration | `hephaestus` / `Luban - Deep Agent` |
| Requirements are unclear | `prometheus` / `Fuxi - Plan Builder` |
| I already have a plan | `atlas` / `Dayu - Plan Executor` |
| I want the plan challenged | `momus` / `Xiezhi - Plan Critic` |
| I need external docs | `librarian` |
| I only need code lookup | `explore` |

## MiMo Compact Mode

MiMo Code can be sensitive to context size, system prompt weight, and tool schema volume. OMM therefore avoids stuffing every heavy multi-agent capability into the default main agent.

By default, `Yugong - ultraworker`:

- Uses a shorter system prompt.
- Keeps core direct execution, verification, and code-editing behavior.
- Disables heavier nested delegation, team delegation, and background delegation by default.
- Preserves legacy agent keys and aliases so existing configs still work.

This is not a downgrade. It is prompt weight control for the MiMo Code harness.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `Yugong - ultraworker` does not appear in the TUI | Run `bun run build` and verify `mimocode.jsonc` points to `oh-my-openagent/dist/index.js`. |
| `sisyphus` does not resolve to `Yugong` | Apply `patches/mimocode-agent-aliases.patch` to the MiMo-Code checkout. |
| `ConnectionRefused` appears | Usually a MiMo hosted service/free-channel issue, not proof that the plugin failed to load. |
| You do not want old config overwritten | The installer writes `.bak.<timestamp>` backups first. |

## License

- Root-level docs, config templates, and scripts use the MIT License. See [LICENSE](LICENSE).
- `oh-my-openagent/` keeps its own SUL-1.0 License.

See [LICENSES.md](LICENSES.md) for the detailed license boundary.

## Contributing

Issues and PRs are welcome. Before changing code, read [CONTRIBUTING.md](CONTRIBUTING.md), especially the verification commands and the rule about not committing local runtime state.

## In One Sentence

Oh My MiMo Code makes MiMo Code feel more like a practical agent workbench: clear entry point, clear roles, clear model routing, and clearer debugging when something goes wrong.
