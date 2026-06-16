import { describe, expect, test } from "bun:test"
import {
  detectRuntimeBinary,
  getRuntimeCliBinary,
  getRuntimeServerEnvVars,
  getRuntimeServerPassword,
  getRuntimeServerUsername,
  isMimocodeRuntime,
} from "./harness-runtime"

describe("harness-runtime", () => {
  test("defaults to OpenCode when no MiMo signal is present", () => {
    const env = {}

    expect(isMimocodeRuntime(env, ["opencode"])).toBe(false)
    expect(detectRuntimeBinary(env, ["opencode"])).toBe("opencode")
    expect(getRuntimeCliBinary("opencode")).toBe("opencode")
  })

  test("detects MiMo from environment and process argv", () => {
    expect(detectRuntimeBinary({ MIMOCODE_HOME: "/tmp/mimo" }, ["opencode"])).toBe("mimocode")
    expect(detectRuntimeBinary({}, ["/usr/local/bin/mimo"])).toBe("mimocode")
    expect(getRuntimeCliBinary("mimocode")).toBe("mimo")
  })

  test("uses MiMo server auth names and default username in MiMo runtime", () => {
    const env = {
      MIMOCODE_HOME: "/tmp/mimo",
      MIMOCODE_SERVER_PASSWORD: "secret",
    }

    expect(getRuntimeServerPassword(env)).toBe("secret")
    expect(getRuntimeServerUsername(env)).toBe("mimocode")
    expect(getRuntimeServerEnvVars(env)).toEqual({
      MIMOCODE_SERVER_PASSWORD: "secret",
      MIMOCODE_SERVER_USERNAME: "mimocode",
    })
  })

  test("preserves non-blank auth environment values exactly", () => {
    const env = {
      MIMOCODE_HOME: "/tmp/mimo",
      MIMOCODE_SERVER_PASSWORD: " secret ",
      MIMOCODE_SERVER_USERNAME: " mimo-user ",
    }

    expect(getRuntimeServerPassword(env)).toBe(" secret ")
    expect(getRuntimeServerUsername(env)).toBe(" mimo-user ")
    expect(getRuntimeServerEnvVars(env)).toEqual({
      MIMOCODE_SERVER_PASSWORD: " secret ",
      MIMOCODE_SERVER_USERNAME: " mimo-user ",
    })
  })

  test("keeps OpenCode server auth names by default", () => {
    const env = {
      OPENCODE_SERVER_PASSWORD: "secret",
      OPENCODE_SERVER_USERNAME: "op",
    }

    expect(getRuntimeServerEnvVars(env)).toEqual({
      OPENCODE_SERVER_PASSWORD: "secret",
      OPENCODE_SERVER_USERNAME: "op",
    })
  })
})
