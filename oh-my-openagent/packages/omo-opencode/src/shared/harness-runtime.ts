import type { OpenCodeBinaryType } from "./opencode-config-dir-types"

type RuntimeEnv = Record<string, string | undefined>

export type RuntimeCliBinary = "opencode" | "mimo"

function hasEnvValue(env: RuntimeEnv, name: string): boolean {
  return Boolean(env[name]?.trim())
}

function getEnvValue(env: RuntimeEnv, name: string): string | undefined {
  const value = env[name]
  return value?.trim() ? value : undefined
}

function hasMimocodeArg(argv: readonly string[]): boolean {
  return argv.some((arg) => {
    const normalized = arg.replaceAll("\\", "/").toLowerCase()
    return /(^|\/)(mimo|mimocode)(\.exe)?$/.test(normalized) || normalized.includes("/mimo-code/")
  })
}

export function isMimocodeRuntime(
  env: RuntimeEnv = process.env,
  argv: readonly string[] = process.argv,
): boolean {
  return hasEnvValue(env, "MIMOCODE") ||
    hasEnvValue(env, "MIMOCODE_HOME") ||
    hasEnvValue(env, "MIMOCODE_CONFIG_DIR") ||
    hasEnvValue(env, "MIMOCODE_BIN_PATH") ||
    hasMimocodeArg(argv)
}

export function detectRuntimeBinary(
  env: RuntimeEnv = process.env,
  argv: readonly string[] = process.argv,
): OpenCodeBinaryType {
  return isMimocodeRuntime(env, argv) ? "mimocode" : "opencode"
}

export function getRuntimeCliBinary(binary: OpenCodeBinaryType = detectRuntimeBinary()): RuntimeCliBinary {
  return binary === "mimocode" ? "mimo" : "opencode"
}

export function getRuntimeServerPassword(env: RuntimeEnv = process.env): string | undefined {
  return isMimocodeRuntime(env)
    ? getEnvValue(env, "MIMOCODE_SERVER_PASSWORD") || getEnvValue(env, "OPENCODE_SERVER_PASSWORD")
    : getEnvValue(env, "OPENCODE_SERVER_PASSWORD") || getEnvValue(env, "MIMOCODE_SERVER_PASSWORD")
}

export function getRuntimeServerUsername(env: RuntimeEnv = process.env): string {
  if (isMimocodeRuntime(env)) {
    return getEnvValue(env, "MIMOCODE_SERVER_USERNAME") || getEnvValue(env, "OPENCODE_SERVER_USERNAME") || "mimocode"
  }

  return getEnvValue(env, "OPENCODE_SERVER_USERNAME") || getEnvValue(env, "MIMOCODE_SERVER_USERNAME") || "opencode"
}

export function getRuntimeServerEnvVars(env: RuntimeEnv = process.env): Record<string, string> {
  const password = getRuntimeServerPassword(env)
  if (!password) return {}

  if (isMimocodeRuntime(env)) {
    return {
      MIMOCODE_SERVER_PASSWORD: password,
      MIMOCODE_SERVER_USERNAME: getRuntimeServerUsername(env),
    }
  }

  return {
    OPENCODE_SERVER_PASSWORD: password,
    OPENCODE_SERVER_USERNAME: getRuntimeServerUsername(env),
  }
}
