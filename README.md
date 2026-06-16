# Oh My MiMo Code

MiMo-Code 的增强版智能体工作台。

它基于 Oh My OpenAgent 改造而来，保留多智能体协作、模型路由、配置分层这些核心思路，同时面向 MiMo-Code 做了轻量化和中文化。你继续打开熟悉的 `mimo` TUI，只是副驾席上多了几位靠谱角色。

## 为什么用它

MiMo-Code 本身已经能写代码，但当任务变复杂时，你通常还需要自己判断：该规划、该查文档、该深挖代码、该换模型、该让谁来挑错。Oh My MiMo Code 把这些工作拆成一组可选的智能体角色，并提供默认配置。

你可以把它理解成：

- MiMo-Code 负责交互界面、会话和模型入口。
- Oh My MiMo Code 负责智能体角色、模型路由、提示词瘦身和配置模板。
- 你负责说清楚要做什么。其余部分尽量少让你手搓。

你需要已经有一个可用的 MiMo-Code 源码目录。Oh My MiMo Code 不替你安装 MiMo-Code 本体，它负责把增强插件和启动配置接到你的 MiMo-Code 上。

## 功能概览

| 能力 | 你会得到什么 |
| --- | --- |
| MiMo TUI 增强 | 正常运行 `mimo` 进入交互式 TUI，不需要换一套奇怪入口。 |
| 角色化智能体 | 主力、深度执行、规划、批评、文档检索、代码探索等角色各干各的活。 |
| 工作流口令 | 在 TUI 里直接说 `ultrawork`、`ulw`、`team`、`hyperplan` 等，触发对应的工作模式。 |
| 模型路由 | 每个 agent 可以单独指定模型、variant 和 fallback。主力用稳的，查资料用快的。 |
| 紧凑上下文 | 默认主智能体使用 MiMo 专用轻量提示词，减少系统提示词和工具 schema 压力。 |
| 旧 key 兼容 | 旧配置 key 仍然可用，例如 `sisyphus` 会解析到 `Yugong - ultraworker`。 |
| 中文神话命名 | 文档里显示中文神话名，运行时使用拼音名，避免 HTTP header 被中文字符绊倒。 |
| 配置模板 | 提供 MiMo 插件配置和 agent/model 配置模板，不用从空白 JSON 开始猜。 |
| MiMo 兼容补丁 | 如果你的 MiMo-Code 还不认识拼音 agent 名，可以应用 `patches/mimocode-agent-aliases.patch`。 |

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 自律主智能体 | `Yugong - ultraworker` 负责理解目标、推进任务、持续验证。适合你打开 TUI 后直接交代工作。 |
| 深度执行角色 | `Luban - Deep Agent` 适合跨文件实现、复杂修复、代码库探索。给目标，不用把每一步都喂到嘴边。 |
| 规划与审查 | `Fuxi` 负责把模糊需求拆清楚，`Xiezhi` 负责挑计划里的坑。先想清楚再动手，少走弯路。 |
| 文档和代码探索 | `librarian` 偏外部资料和文档，`explore` 偏本地代码定位。一个查书，一个探路。 |
| 模型按角色分配 | 主力、执行、搜索、视觉类角色可以用不同模型；也可以设置备用模型链。 |
| 上下文减重 | MiMo 默认路径不启用过重嵌套委托，避免提示词太大、工具太多、请求太胖。 |

## 快速开始

最省事的方式：把这个仓库的 GitHub 链接发给 MiMo Code，并让它按 [prompts/setup-with-mimo-code.md](prompts/setup-with-mimo-code.md) 安装 OMM。现在已经是agent的年代了，不会真的有人给agent安装插件还是自己安装吧？

你可以直接这样说：

```text
请打开这个 GitHub 仓库，按里面的 prompts/setup-with-mimo-code.md 帮我安装并初始化 Oh My MiMo Code：
<这里粘贴 OMM 的 GitHub 链接>
```

MiMo Code 应该自己完成 clone、build、安装 wrapper、写入配置和验证。默认模型会先用 `mimo/mimo-auto`；只有当你想给不同 agent 配不同模型时，它才需要继续问你有哪些 Provider / 模型可用。

如果你想手动安装，先准备 Bun 和一个可用的 MiMo-Code 源码目录，然后在 Oh My MiMo Code 仓库根目录执行：

```bash
cd oh-my-openagent
bun install
bun run build
cd ..
MIMOCODE_SOURCE_DIR=/absolute/path/to/MiMo-Code/packages/opencode \
  ./scripts/install-mimo-wrapper.sh
```

安装脚本会：

- 创建 `~/bin/mimo` 快捷启动脚本。
- 写入 `~/.config/mimocode/mimocode.jsonc`，让 MiMo-Code 加载本项目插件。
- 写入 `~/.config/mimocode/oh-my-openagent.jsonc`，默认把主智能体绑定到 `mimo/mimo-auto`。
- 如果已有旧配置，会先备份，不会静默覆盖。

如果你的 MiMo-Code checkout 还不支持 `sisyphus -> Yugong` 这类别名解析，可以先应用兼容补丁：

```bash
cd /absolute/path/to/MiMo-Code
patch -p1 < /absolute/path/to/oh-my-mimo-code/patches/mimocode-agent-aliases.patch
```

如果你的 shell 还没有把 `~/bin` 放进 `PATH`，加一次：

```bash
export PATH="$HOME/bin:$PATH"
```

然后正常打开 MiMo-Code TUI：

```bash
mimo
```

进入 TUI 后，选择或切换到 `Yugong - ultraworker`，就可以按正常 MiMo-Code 的交互方式使用。

## 初始化模型配置

OMM 的推荐初始化方式不是让你照着示例硬改 JSON，而是让 MiMo Code 先问清楚你有什么模型，再写配置。

推荐流程：

1. 把 OMM 的 GitHub 链接发给 MiMo Code。
2. 让它读取 [prompts/setup-with-mimo-code.md](prompts/setup-with-mimo-code.md)。
3. 它会自己完成安装和默认配置。
4. 如果你要多模型路由，再回答它关于 OpenAI / Gemini / Copilot / 其他 Provider 的问题。
5. 重新打开 `mimo`，用 `/agent` 和 `/model` 检查结果。

如果你不确定怎么选模型，保持默认 `mimo/mimo-auto` 就可以。想进阶时，再让 MiMo Code 按你的可用账号给这些角色分配模型：

| 角色 | 配置 key | 建议 |
| --- | --- | --- |
| 主力推进 | `sisyphus` | 默认 `mimo/mimo-auto`，稳定优先。 |
| 深度执行 | `hephaestus` | 放你最强的代码模型。 |
| 文档检索 | `librarian` | 放便宜、快、长上下文友好的模型。 |
| 代码探索 | `explore` | 放响应快的代码搜索/理解模型。 |

## 常用入口

| 入口 | 用途 |
| --- | --- |
| `mimo` | 打开 MiMo-Code 交互式 TUI。正常使用从这里开始。 |
| `mimo /path/to/project` | 在指定项目目录打开 TUI。 |
| `/agent` | 在 TUI 里切换 agent；主智能体是 `Yugong - ultraworker`。 |
| `/model` | 在 TUI 里切换模型；默认配置走 `mimo/mimo-auto`。 |
| `/goal` | 给长任务设置完成判断。 |
| `/dream` | 从最近会话里提炼可复用记忆。 |
| `/distill` | 把重复工作流沉淀成技能、子 agent 或命令。 |
| `/voice` | 语音输入能力，取决于 MiMo 登录和运行环境。 |

具体斜杠命令会随 MiMo-Code 当前版本、登录状态和模型服务变化。这里列的是用户最常用、最不容易跑偏的入口。

## OMM 操作入口

OMM 继承的是 OMO 的“操作方式”，不只是几个 agent 名字。入口大致分两种：

- 直接在 TUI 里输入的工作流口令，例如 `ultrawork`、`ulw`、`team`。
- 以 `/` 开头的斜杠命令，例如 `/start-work`、`/ulw-loop`。

不同 MiMo-Code 版本对自定义 command、hook 和 Team Mode 工具的支持不完全一样；如果某个入口没有出现，优先检查插件是否加载、配置是否启用，再看当前 MiMo-Code 是否支持这类 OpenCode 兼容能力。

### 工作流口令

这些不是 shell 命令，也不是 `mimo xxx` 子命令。打开 `mimo` 进入 TUI 后，直接把它们当消息发给 agent。

| 口令 | 适合什么时候用 | 它会做什么 |
| --- | --- | --- |
| `ultrawork` / `ulw` | 不想拆任务，只想让它高强度推进。 | 触发并行执行工作流：先明确验收标准，再把可并行的探索、实现、验证分开跑。OMM 里这是最接近“开干”的入口。 |
| `team` | 一个任务明显能拆成多路并行，且你希望多个成员分工。 | 进入 Team Mode 思路：领导 agent 协调多个成员，适合大规模改造、审计、迁移。需要当前 MiMo-Code 兼容相关 team 工具。 |
| `hyperplan` | 你已经有想法，但怕计划有洞。 | 让多个批评视角先拆你的计划，找隐藏约束、风险、测试缺口，再决定怎么执行。适合动手前的重大方案审查。 |
| `search` | 需要查外部资料、官方文档或社区线索。 | 把任务导向检索/研究模式，减少主智能体靠记忆硬猜。 |
| `analyze` | 需要先读懂项目结构、依赖关系或现有实现。 | 把任务导向代码库分析模式，先给你地图，再决定改哪里。 |

### 斜杠命令

| 命令 | 适合什么时候用 | 它会做什么 |
| --- | --- | --- |
| `/init-deep` | 新项目首次接入，或者项目目录层级很深。 | 生成分层 `AGENTS.md` 项目知识库，让 agent 在不同目录读到更贴近局部代码的上下文。 |
| `/start-work [plan-name]` | 已经有计划，希望按计划执行。 | 从规划产物中启动执行流程，通常交给执行型 agent 按 TODO / 验收标准推进。 |
| `/ralph-loop "目标"` | 长任务需要持续推进，不想 agent 中途停在半路。 | 启动自我延续式开发循环，直到完成、达到上限或被取消。适合大任务，但也更吃上下文和模型稳定性。 |
| `/ulw-loop "目标"` | 既要持续循环，又要 ultrawork 的高强度并行。 | Ralph Loop + Ultrawork 的组合：持续推进、并行探索、不断验证。重型任务才建议用。 |
| `/cancel-ralph` | Ralph / ulw loop 跑偏了，或者你想停下来。 | 取消正在进行的 Ralph Loop。 |
| `/stop-continuation` | 不想让任何续跑机制继续接管会话。 | 停止 Ralph Loop、todo continuation、Boulder 等延续机制。 |
| `/handoff` | 需要换会话继续，但不想丢上下文。 | 生成接力摘要：当前状态、已完成内容、剩余任务、关键文件路径。 |
| `/refactor <target>` | 想做结构化重构，而不是随手改几行。 | 结合 LSP、AST-grep、架构分析和测试验证来做重构。适合模块整理、API 调整、命名迁移。 |
| `/remove-deadcode` | 想清掉未使用代码，但不想靠肉眼猜。 | 扫描 TypeScript 未使用项、用 LSP 引用检查做二次确认，再按文件分批移除。重点是降低误删公开 API、入口文件、测试消费者的风险。 |
| `/security-research` | 想做一次偏安全研究的代码审计。 | 调用安全研究工作流，让漏洞猎手和 PoC 思路分工检查。适合发现注入、越权、配置泄露这类问题。 |
| `/get-unpublished-changes` | 项目维护者准备发版前，想知道 HEAD 相比已发布版本到底改了什么。 | 对比 npm 已发布版本和当前 HEAD，按影响范围、改动类型和破坏性风险整理变更，并给出版本建议。 |
| `/publish <patch\|minor\|major>` | 项目维护者发版本时使用。 | 走完整发布检查、触发 GitHub Actions、验证 npm 和 GitHub 版本结果。普通使用者可以忽略它。 |
| `/omomomo` | 手滑、好奇，或者今天想看彩蛋。 | 打印一个关于原项目的小彩蛋。严肃程度约等于在终端里发现隐藏房间。 |

这些 command 本质上是给 agent 看的任务模板，不是传统 CLI 子命令。你不需要记住所有命令；普通开发时，`ulw`、`/start-work`、`/handoff`、`/remove-deadcode` 和 `/security-research` 最有实际价值。

## 智能体角色

本项目保留底层旧配置 key，但把主要显示名换成中国神话 / 传说风格的拼音名。为什么不直接用中文汉字？因为 agent 名会进入 HTTP header，直接写 `愚公 - ultraworker` 会触发 `ERR_INVALID_CHAR`。不是我们不爱中文，是 HTTP 比较古板。

| 配置 key | 中文名 | 实际显示名 | 适合做什么 |
| --- | --- | --- | --- |
| `sisyphus` | 愚公 | `Yugong - ultraworker` | 默认主力。理解需求、推进任务、改代码、验证结果。 |
| `hephaestus` | 鲁班 | `Luban - Deep Agent` | 深度执行。适合复杂实现、跨文件改造、长时间代码探索。 |
| `prometheus` | 伏羲 | `Fuxi - Plan Builder` | 计划构建。适合需求澄清、任务分解、制定实施计划。 |
| `atlas` | 大禹 | `Dayu - Plan Executor` | 计划执行。适合按已有 TODO / PRD / test spec 推进。 |
| `sisyphus-junior` | 小愚公 | `Xiao-Yugong` | 小型专注执行。适合边界清楚的小任务。 |
| `metis` | 九天玄女 | `Jiutian-Xuannu - Plan Consultant` | 计划顾问。适合找隐藏约束、补洞、提示风险。 |
| `momus` | 獬豸 | `Xiezhi - Plan Critic` | 计划批评。适合审查含糊需求、指出逻辑问题和测试缺口。 |
| `athena` | 西王母 | `Xiwangmu - Council` | 评审角色。适合多视角权衡和重要方案复核。 |
| `athena-junior` | 小西王母 | `Xiwangmu-Junior - Council` | 轻量评审。适合较小范围复核。 |
| `oracle` | 神谕 | `oracle` | 架构、疑难问题和复杂诊断。 |
| `librarian` | 藏书官 | `librarian` | 外部文档、API、社区资料检索。 |
| `explore` | 探路者 | `explore` | 本地代码搜索、文件定位、调用关系梳理。 |
| `multimodal-looker` | 观象者 | `multimodal-looker` | 图片、截图、视觉材料分析。 |

## 怎么选

| 你的情况 | 推荐 |
| --- | --- |
| 我就想让它把事做完 | 愚公：`sisyphus` / `Yugong - ultraworker` |
| 任务很复杂，代码要深挖 | 鲁班：`hephaestus` / `Luban - Deep Agent` |
| 需求还没想清楚 | 伏羲：`prometheus` / `Fuxi - Plan Builder` |
| 已经有计划，只差执行 | 大禹：`atlas` / `Dayu - Plan Executor` |
| 我怕计划有坑 | 獬豸：`momus` / `Xiezhi - Plan Critic` |
| 我需要查外部资料 | 藏书官：`librarian` |
| 我只想知道代码在哪 | 探路者：`explore` |

## 模型路由

<details>
<summary>展开查看模型配置示例</summary>

模型配置在：

```text
~/.config/mimocode/oh-my-openagent.jsonc
```

默认配置使用 MiMo 自动路由：

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "mimo/mimo-auto"
    }
  }
}
```

你也可以按角色分配模型：

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

模型不稳定、额度不足或某个 provider 偶尔抽风时，可以给 agent 配 `fallback_models`：

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

如果你只想用 MiMo 官方路由，保持 `mimo/mimo-auto` 就够了。多模型路由是给进阶用户的，不是入门考试。

</details>

## MiMo 紧凑模式

MiMo 对上下文、系统提示词和工具 schema 的体积更敏感，所以 Oh My MiMo Code 默认不会把所有重型多智能体能力一股脑塞进主智能体。

默认 `Yugong - ultraworker` 会：

- 使用更短的系统提示词。
- 保留直接执行、验证和代码修改所需的核心行为。
- 禁用过重的嵌套任务、团队委托、后台委托。
- 保留旧 agent key 和显示名别名，避免用户配置突然失忆。

这不是阉割，是减重。毕竟愚公移山靠的是持续挖，不是先把整座山写进 prompt。

## 故障排查

| 现象 | 说明 |
| --- | --- |
| TUI 里看不到 `Yugong - ultraworker` | 先确认 `bun run build` 已执行，`mimocode.jsonc` 里的插件路径指向 `oh-my-openagent/dist/index.js`。 |
| `sisyphus` 不能解析到 `Yugong` | 给 MiMo-Code checkout 应用 `patches/mimocode-agent-aliases.patch`。 |
| 出现 `ConnectionRefused` | 多半是 MiMo 托管服务 / 免费通道连接问题，不代表插件没加载。 |
| 不想覆盖旧配置 | 安装脚本会先写 `.bak.<timestamp>` 备份。 |

## 许可证

- 根目录新增文档、配置模板和脚本使用 MIT License，见 `LICENSE`。
- `oh-my-openagent/` 保留自己的 SUL-1.0 License。

更详细的许可证边界见 `LICENSES.md`。

## 贡献

欢迎提 issue 和 PR。改动前建议先读 `CONTRIBUTING.md`，尤其是验证命令和“不要把本地运行状态提交上来”的部分。

## 一句话收尾

Oh My MiMo Code 的目标不是发明第三套宇宙规则，而是让 MiMo-Code 变成一个更顺手的智能体工作台：入口清楚、角色清楚、模型配置清楚，出了问题也知道该先查哪里。
