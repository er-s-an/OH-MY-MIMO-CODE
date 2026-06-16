import { describe, it, expect } from "bun:test"
import { validateHeaderValue } from "node:http"
import { AGENT_DISPLAY_NAMES, getAgentConfigKey, getAgentDisplayName, getAgentListDisplayName, normalizeAgentForPrompt, normalizeAgentForPromptKey, stripAgentListSortPrefix } from "./agent-display-names"

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // given config key "sisyphus"
    const configKey = "sisyphus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Yugong - ultraworker"
    expect(result).toBe("Yugong - ultraworker")
  })

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // given config key "Sisyphus" (old format)
    const configKey = "Sisyphus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Yugong - ultraworker" (case-insensitive lookup)
    expect(result).toBe("Yugong - ultraworker")
  })

  it("returns original key for unknown agents (fallback)", () => {
    // given config key "custom-agent"
    const configKey = "custom-agent"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "custom-agent" (original key unchanged)
    expect(result).toBe("custom-agent")
  })

  it("returns display name for atlas", () => {
    // given config key "atlas"
    const configKey = "atlas"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

     // then returns "Dayu - Plan Executor"
    expect(result).toBe("Dayu - Plan Executor")
  })

  it("returns display name for prometheus", () => {
    // given config key "prometheus"
    const configKey = "prometheus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Fuxi - Plan Builder"
    expect(result).toBe("Fuxi - Plan Builder")
  })

  it("returns display name for sisyphus-junior", () => {
    // given config key "sisyphus-junior"
    const configKey = "sisyphus-junior"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Xiao-Yugong"
    expect(result).toBe("Xiao-Yugong")
  })

  it("returns display name for metis", () => {
    // given config key "metis"
    const configKey = "metis"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "Jiutian-Xuannu - Plan Consultant"
    expect(result).toBe("Jiutian-Xuannu - Plan Consultant")
  })

  it("returns display name for momus", () => {
    // given config key "momus"
    const configKey = "momus"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

     // then returns "Xiezhi - Plan Critic"
    expect(result).toBe("Xiezhi - Plan Critic")
  })

  it("returns display name for oracle", () => {
    // given config key "oracle"
    const configKey = "oracle"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "oracle"
    expect(result).toBe("oracle")
  })

  it("returns display name for librarian", () => {
    // given config key "librarian"
    const configKey = "librarian"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "librarian"
    expect(result).toBe("librarian")
  })

  it("returns display name for explore", () => {
    // given config key "explore"
    const configKey = "explore"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "explore"
    expect(result).toBe("explore")
  })

  it("returns display name for multimodal-looker", () => {
    // given config key "multimodal-looker"
    const configKey = "multimodal-looker"

    // when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // then returns "multimodal-looker"
    expect(result).toBe("multimodal-looker")
  })

  it("preserves CJK display-name overrides verbatim", () => {
    expect(getAgentDisplayName("sisyphus", { sisyphus: { displayName: "Sisyphus - 主脑" } })).toBe("Sisyphus - 主脑")
    expect(getAgentDisplayName("hephaestus", { hephaestus: { displayName: "헤파이스토스" } })).toBe("헤파이스토스")
    expect(getAgentDisplayName("atlas", { atlas: { displayName: "アトラス" } })).toBe("アトラス")
  })
})

describe("getAgentConfigKey", () => {
  it("resolves display name to config key", () => {
    // given display name "Yugong - ultraworker"
    // when getAgentConfigKey called
    // then returns "sisyphus"
    expect(getAgentConfigKey("Yugong - ultraworker")).toBe("sisyphus")
  })

  it("resolves display name case-insensitively", () => {
    // given display name in different case
    // when getAgentConfigKey called
    // then returns "atlas"
    expect(getAgentConfigKey("dayu - plan executor")).toBe("atlas")
  })

  it("resolves legacy parenthesized display names", () => {
    // given legacy parenthesized display name from old configs/sessions
    // when getAgentConfigKey called
    // then resolves to canonical config key
    expect(getAgentConfigKey("Sisyphus (Ultraworker)")).toBe("sisyphus")
    expect(getAgentConfigKey("Atlas (Plan Executor)")).toBe("atlas")
    expect(getAgentConfigKey("Sisyphus - Ultraworker")).toBe("sisyphus")
    expect(getAgentConfigKey("Atlas - Plan Executor")).toBe("atlas")
  })

  it("passes through lowercase config keys unchanged", () => {
    // given lowercase config key "prometheus"
    // when getAgentConfigKey called
    // then returns "prometheus"
    expect(getAgentConfigKey("prometheus")).toBe("prometheus")
  })

  it("returns lowercased unknown agents", () => {
    // given unknown agent name
    // when getAgentConfigKey called
    // then returns lowercased
    expect(getAgentConfigKey("Custom-Agent")).toBe("custom-agent")
  })

  it("resolves all core agent display names", () => {
    // given all core display names
    // when/then each resolves to its config key
    expect(getAgentConfigKey("Luban - Deep Agent")).toBe("hephaestus")
    expect(getAgentConfigKey("Fuxi - Plan Builder")).toBe("prometheus")
    expect(getAgentConfigKey("Dayu - Plan Executor")).toBe("atlas")
    expect(getAgentConfigKey("Jiutian-Xuannu - Plan Consultant")).toBe("metis")
    expect(getAgentConfigKey("Xiezhi - Plan Critic")).toBe("momus")
    expect(getAgentConfigKey("Xiao-Yugong")).toBe("sisyphus-junior")
  })

  it("resolves atlas even when the UI ordering prefix is present", () => {
    expect(getAgentConfigKey(getAgentListDisplayName("atlas"))).toBe("atlas")
  })

  it("resolves display names even when zero-width characters are embedded", () => {
    expect(getAgentConfigKey("Yugong\u200B - Ultraworker")).toBe("sisyphus")
    expect(getAgentConfigKey("\uFEFFDayu - Plan Executor")).toBe("atlas")
  })
})

describe("getAgentListDisplayName", () => {
  it("returns the canonical display name for the core agent list", () => {
    expect(getAgentListDisplayName("sisyphus")).toBe("Yugong - ultraworker")
    expect(getAgentListDisplayName("hephaestus")).toBe("Luban - Deep Agent")
    expect(getAgentListDisplayName("prometheus")).toBe("Fuxi - Plan Builder")
    expect(getAgentListDisplayName("atlas")).toBe("Dayu - Plan Executor")
  })

  it("keeps non-core agents unchanged for list display", () => {
    expect(getAgentListDisplayName("oracle")).toBe("oracle")
  })

  it("is a thin alias for getAgentDisplayName", () => {
    expect(getAgentListDisplayName("sisyphus")).toBe(getAgentDisplayName("sisyphus"))
  })
})

describe("stripAgentListSortPrefix", () => {
  it("strips legacy zero-width sort prefixes baked into v3.14.0–v3.16.0 sessions", () => {
    expect(stripAgentListSortPrefix("\u200B\u200BLuban - Deep Agent")).toBe("Luban - Deep Agent")
  })

  it("strips leading and trailing wrapper characters after sort prefix removal", () => {
    expect(stripAgentListSortPrefix("\\Luban - Deep Agent\\")).toBe("Luban - Deep Agent")
  })
})

describe("normalizeAgentForPrompt", () => {
  it("strips core UI ordering prefixes back to canonical display names", () => {
    expect(normalizeAgentForPrompt(getAgentListDisplayName("sisyphus"))).toBe("Yugong - ultraworker")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("hephaestus"))).toBe("Luban - Deep Agent")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("prometheus"))).toBe("Fuxi - Plan Builder")
    expect(normalizeAgentForPrompt(getAgentListDisplayName("atlas"))).toBe("Dayu - Plan Executor")
  })

  it("removes zero-width characters before returning canonical names", () => {
    expect(normalizeAgentForPrompt("Yugong\u200B - Ultraworker")).toBe("Yugong - ultraworker")
  })

  it("converts legacy parenthesized names to canonical display names", () => {
    expect(normalizeAgentForPrompt("Atlas (Plan Executor)")).toBe("Dayu - Plan Executor")
  })
})

describe("normalizeAgentForPromptKey", () => {
  it("converts built-in display names to config keys", () => {
    expect(normalizeAgentForPromptKey("Sisyphus (Ultraworker)")).toBe("sisyphus")
  })

  it("strips UI ordering prefixes before returning config keys", () => {
    expect(normalizeAgentForPromptKey(getAgentListDisplayName("atlas"))).toBe("atlas")
  })

  it("preserves custom agents", () => {
    expect(normalizeAgentForPromptKey("MyCustomAgent")).toBe("MyCustomAgent")
  })
})

describe("AGENT_DISPLAY_NAMES", () => {
  it("contains all expected agent mappings", () => {
    // given expected mappings
    const expectedMappings = {
      sisyphus: "Yugong - ultraworker",
      hephaestus: "Luban - Deep Agent",
      prometheus: "Fuxi - Plan Builder",
      atlas: "Dayu - Plan Executor",
      "sisyphus-junior": "Xiao-Yugong",
      metis: "Jiutian-Xuannu - Plan Consultant",
      momus: "Xiezhi - Plan Critic",
      athena: "Xiwangmu - Council",
      "athena-junior": "Xiwangmu-Junior - Council",
      oracle: "oracle",
      librarian: "librarian",
      explore: "explore",
      "multimodal-looker": "multimodal-looker",
      "council-member": "council-member",
    }

    // when checking the constant
    // then contains all expected mappings
    expect(AGENT_DISPLAY_NAMES).toEqual(expectedMappings)
  })

  it("all display names must be HTTP-header-safe", () => {
    for (const [, displayName] of Object.entries(AGENT_DISPLAY_NAMES)) {
      expect(() => validateHeaderValue("x-opencode-agent-name", displayName)).not.toThrow()
    }
  })
})
