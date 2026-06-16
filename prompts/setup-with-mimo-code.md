# MiMo Code Setup Prompt

把下面这段和 OMM 的 GitHub 仓库链接一起发给 MiMo Code。正常情况下，用户只需要提供仓库链接；MiMo Code 应该自己完成 clone、build、安装、配置和验证。只有当用户想给不同 agent 配不同模型时，才需要进入模型问答。

```text
请帮我安装并初始化 Oh My MiMo Code（OMM）。

OMM 仓库链接：
<把 Oh My MiMo Code 的 GitHub 链接粘贴在这里>

你需要自己完成部署，不要让我手动照着步骤猜命令。请按这个流程执行：

1. 读取 OMM 仓库 README，确认安装方式、许可证边界和 MiMo-Code 依赖关系。
2. 如果本机还没有 OMM 仓库，请 clone 到合适的本地目录；如果已经有，请进入已有目录。
3. 找到本机 MiMo-Code 源码目录。目标目录必须包含 `packages/opencode/src/index.ts`。
   - 如果你找不到，再问我 MiMo-Code 放在哪里。
4. 检查 Bun 是否可用；如果不可用，告诉我需要安装 Bun。
5. 在 OMM 仓库里构建插件：
   - `cd oh-my-openagent`
   - `bun install`
   - `bun run build`
6. 回到 OMM 根目录，安装 wrapper 和配置：
   - `MIMOCODE_SOURCE_DIR=/实际的/MiMo-Code/packages/opencode ./scripts/install-mimo-wrapper.sh`
7. 检查 MiMo-Code 是否已经支持 `sisyphus -> Yugong - ultraworker` 这类别名。
   - 如果不支持，再在 MiMo-Code checkout 中应用：
     `patch -p1 < /OMM仓库路径/patches/mimocode-agent-aliases.patch`
8. 备份并写入：
   - `~/.config/mimocode/mimocode.jsonc`
   - `~/.config/mimocode/oh-my-openagent.jsonc`
9. 最后让我运行 `mimo`，进入 TUI 后用 `/agent` 和 `/model` 检查。

默认模型策略：
- 如果我没有主动要求多模型配置，保持默认：
  - `sisyphus`: `mimo/mimo-auto`
- 不要一开始就让我填写一堆模型。

只有当我说“我要配置不同模型”或“我有 OpenAI/Gemini/Copilot/其他模型可用”时，你再问：
1. 是否保留 `mimo/mimo-auto` 作为主力默认？
2. 我有哪些可用 Provider / 模型？请让我用 `provider/model` 格式回答。
3. 是否要按角色分配：
   - `sisyphus` / `Yugong - ultraworker`: 主力推进，稳定优先
   - `hephaestus` / `Luban - Deep Agent`: 深度执行，放最强代码模型
   - `librarian`: 文档检索，放快、便宜、长上下文友好的模型
   - `explore`: 代码探索，放响应快的代码模型
4. 是否需要 fallback 模型链。

约束：
- 正常使用入口是交互式 TUI：`mimo`。不要把 `mimo run` 当日常入口推荐。
- 写任何用户配置前先备份。
- 不要把 API key 写进 OMM 仓库。
- 如果遇到 `ConnectionRefused`，请区分“MiMo 托管服务连接问题”和“插件没有加载”。
- 最后请给我一个简短结果：安装位置、写入的配置文件、当前默认 agent、当前默认模型、还有我下一步该在 TUI 里检查什么。
```
