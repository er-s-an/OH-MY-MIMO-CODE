import { describe, expect, test } from "bun:test"
import { resolveServerUrl } from "./resolve-server-url"

describe("resolveServerUrl", () => {
  test("uses MIMOCODE_PORT before OPENCODE_PORT for port-0 fallback", () => {
    const messages: string[] = []

    const result = resolveServerUrl(
      "http://127.0.0.1:0",
      { MIMOCODE_PORT: "5679", OPENCODE_PORT: "5678" },
      (message) => messages.push(message),
    )

    expect(result).toBe("http://localhost:5679")
    expect(messages[0]).toContain("MIMOCODE_PORT")
  })
})
