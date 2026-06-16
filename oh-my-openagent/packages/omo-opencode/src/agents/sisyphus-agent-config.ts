import type { AgentConfig } from "@opencode-ai/sdk"
import { getFrontierToolSchemaPermission } from "./frontier-tool-schema-guard"
import { getGptApplyPatchPermission } from "./gpt-apply-patch-guard"
import { buildClaudeThinkingConfig } from "./types"
import type { AgentMode } from "./types"

export const SISYPHUS_DEFAULT_MAX_TOKENS = 64000
export const MIMO_SISYPHUS_MAX_TOKENS = 8192

const SISYPHUS_DESCRIPTION =
  "Powerful AI orchestrator. Plans obsessively with todos, assesses search complexity before exploration, delegates strategically via category+skills combinations. Uses explore for internal code (parallel-friendly), librarian for external docs. (Yugong - OhMyOpenAgent)"

function buildSisyphusPermission(model: string): AgentConfig["permission"] {
  return {
    question: "allow",
    call_omo_agent: "deny",
    ...getFrontierToolSchemaPermission(model),
    ...getGptApplyPatchPermission(model),
  } as AgentConfig["permission"]
}

function buildBaseSisyphusAgentConfig(
  mode: AgentMode,
  model: string,
  prompt: string,
): AgentConfig {
  return {
    description: SISYPHUS_DESCRIPTION,
    mode,
    model,
    maxTokens: SISYPHUS_DEFAULT_MAX_TOKENS,
    prompt,
    color: "#00CED1",
    permission: buildSisyphusPermission(model),
  }
}

export function buildGptSisyphusAgentConfig(
  mode: AgentMode,
  model: string,
  prompt: string,
): AgentConfig {
  return {
    ...buildBaseSisyphusAgentConfig(mode, model, prompt),
    reasoningEffort: "medium",
  }
}

export function buildClaudeSisyphusAgentConfig(
  mode: AgentMode,
  model: string,
  prompt: string,
): AgentConfig {
  return {
    ...buildBaseSisyphusAgentConfig(mode, model, prompt),
    ...buildClaudeThinkingConfig(model),
  }
}

export function buildMimoSisyphusAgentConfig(
  mode: AgentMode,
  model: string,
  prompt: string,
): AgentConfig {
  return {
    ...buildBaseSisyphusAgentConfig(mode, model, prompt),
    maxTokens: MIMO_SISYPHUS_MAX_TOKENS,
    permission: {
      "*": "deny",
      bash: "allow",
      edit: "allow",
      glob: "allow",
      grep: "allow",
      question: "allow",
      read: "allow",
      webfetch: "allow",
      write: "allow",
      call_omo_agent: "deny",
      task: "deny",
      "task_*": "deny",
      teammate: "deny",
      background_output: "deny",
      background_cancel: "deny",
    } as AgentConfig["permission"],
  }
}
