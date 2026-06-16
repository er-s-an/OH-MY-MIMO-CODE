import { existsSync, realpathSync } from "node:fs"
import { homedir } from "node:os"
import { join, posix, resolve, win32 } from "node:path"

import { CONFIG_BASENAME } from "./plugin-identity"

import type {
  OpenCodeBinaryType,
  OpenCodeConfigDirOptions,
  OpenCodeConfigPaths,
} from "./opencode-config-dir-types"

export type {
  OpenCodeBinaryType,
  OpenCodeConfigDirOptions,
  OpenCodeConfigPaths,
} from "./opencode-config-dir-types"

export const TAURI_APP_IDENTIFIER = "ai.opencode.desktop"
export const TAURI_APP_IDENTIFIER_DEV = "ai.opencode.desktop.dev"

export function isDevBuild(version: string | null | undefined): boolean {
  if (!version) return false
  return version.includes("-dev") || version.includes(".dev")
}

function getTauriConfigDir(identifier: string): string {
  const platform = process.platform

  switch (platform) {
    case "darwin":
      return join(homedir(), "Library", "Application Support", identifier)

    case "win32": {
      const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming")
      return win32.join(appData, identifier)
    }

    case "linux":
    default: {
      const xdgConfig = process.env.XDG_CONFIG_HOME || join(homedir(), ".config")
      return join(xdgConfig, identifier)
    }
  }
}

function resolveConfigPath(pathValue: string): string {
  if (isWslEnvironment() && pathValue.startsWith("/")) {
    return posix.normalize(pathValue)
  }

  const resolvedPath = resolve(pathValue)
  if (!existsSync(resolvedPath)) return resolvedPath

  try {
    return realpathSync(resolvedPath)
  } catch (error) {
    if (error instanceof Error) {
      return resolvedPath
    }
    return resolvedPath
  }
}

function isWslEnvironment(): boolean {
  return process.platform === "linux" &&
    (Boolean(process.env.WSL_DISTRO_NAME?.trim()) || Boolean(process.env.WSL_INTEROP?.trim()))
}

function isWindowsUserConfigRoot(pathValue: string): boolean {
  const normalizedPath = pathValue.replaceAll("\\", "/").toLowerCase()
  return /^[a-z]:\/users\//.test(normalizedPath) || /^\/mnt\/[a-z]\/users\//.test(normalizedPath)
}

function getWindowsUserFromConfigRoot(pathValue: string): string | null {
  const normalizedPath = pathValue.replaceAll("\\", "/")
  const match = /^(?:[a-z]:|\/mnt\/[a-z])\/Users\/([^/]+)/i.exec(normalizedPath)
  return match?.[1] ?? null
}

function getWslLinuxHomeDir(windowsConfigRoot?: string): string | null {
  const envHome = process.env.HOME?.trim()
  if (envHome && envHome.startsWith("/") && !isWindowsUserConfigRoot(envHome)) {
    return envHome
  }

  const user = process.env.USER?.trim() || process.env.LOGNAME?.trim() ||
    process.env.SUDO_USER?.trim() ||
    (windowsConfigRoot ? getWindowsUserFromConfigRoot(windowsConfigRoot) : undefined)
  return user ? posix.join("/home", user) : null
}

function getCliDefaultConfigDir(appName = "opencode"): string {
  const envXdgConfig = process.env.XDG_CONFIG_HOME?.trim()
  const shouldIgnoreWindowsXdg = envXdgConfig !== undefined && envXdgConfig.length > 0 &&
    isWslEnvironment() && isWindowsUserConfigRoot(envXdgConfig)
  const xdgConfig = shouldIgnoreWindowsXdg
    ? posix.join(getWslLinuxHomeDir(envXdgConfig) ?? "/home", ".config")
    : envXdgConfig || join(homedir(), ".config")
  const configDir = isWslEnvironment() ? posix.join(xdgConfig, appName) : join(xdgConfig, appName)
  return resolveConfigPath(configDir)
}

function getCliCustomConfigDir(envName = "OPENCODE_CONFIG_DIR"): string | null {
  const envConfigDir = process.env[envName]?.trim()
  if (!envConfigDir) {
    return null
  }

  return resolveConfigPath(envConfigDir)
}

function getCliConfigDir(appName = "opencode", envName = "OPENCODE_CONFIG_DIR"): string {
  return getCliCustomConfigDir(envName) ?? getCliDefaultConfigDir(appName)
}

function getMimocodeHomeConfigDir(): string | null {
  const mimocodeHome = process.env.MIMOCODE_HOME?.trim()
  if (!mimocodeHome) return null
  return resolveConfigPath(join(mimocodeHome, "config"))
}

function getMimocodeConfigDir(): string {
  return getMimocodeHomeConfigDir() ?? getCliConfigDir("mimocode", "MIMOCODE_CONFIG_DIR")
}

export function getOpenCodeConfigDirs(options: OpenCodeConfigDirOptions): string[] {
  if (options.binary === "mimocode") {
    const customConfigDir = getCliCustomConfigDir("MIMOCODE_CONFIG_DIR")
    const mimocodeHomeConfigDir = getMimocodeHomeConfigDir()

    return Array.from(
      new Set([
        ...(mimocodeHomeConfigDir ? [mimocodeHomeConfigDir] : []),
        ...(customConfigDir ? [customConfigDir] : []),
        getCliDefaultConfigDir("mimocode"),
      ]),
    )
  }

  if (options.binary !== "opencode") {
    return [getOpenCodeConfigDir(options)]
  }

  const customConfigDir = getCliCustomConfigDir()

  return Array.from(
    new Set([
      ...(customConfigDir ? [customConfigDir] : []),
      getCliDefaultConfigDir(),
    ]),
  )
}

export function getOpenCodeConfigDir(options: OpenCodeConfigDirOptions): string {
  const { binary, version, checkExisting = true } = options

  if (binary === "mimocode") {
    return getMimocodeConfigDir()
  }

  if (binary === "opencode") {
    return getCliConfigDir()
  }

  const identifier = isDevBuild(version) ? TAURI_APP_IDENTIFIER_DEV : TAURI_APP_IDENTIFIER
  const tauriDirBase = getTauriConfigDir(identifier)
  const tauriDir = process.platform === "win32"
    ? (win32.isAbsolute(tauriDirBase) ? win32.normalize(tauriDirBase) : win32.resolve(tauriDirBase))
    : resolveConfigPath(tauriDirBase)

  if (checkExisting) {
    const legacyDir = getCliConfigDir()
    const legacyConfig = join(legacyDir, "opencode.json")
    const legacyConfigC = join(legacyDir, "opencode.jsonc")

    if (existsSync(legacyConfig) || existsSync(legacyConfigC)) {
      return legacyDir
    }
  }

  return tauriDir
}

export function getOpenCodeConfigPaths(options: OpenCodeConfigDirOptions): OpenCodeConfigPaths {
  const configDir = getOpenCodeConfigDir(options)
  const configBasename = options.binary === "mimocode" ? "mimocode" : "opencode"

  return {
    configDir,
    configJson: join(configDir, `${configBasename}.json`),
    configJsonc: join(configDir, `${configBasename}.jsonc`),
    packageJson: join(configDir, "package.json"),
    omoConfig: join(configDir, `${CONFIG_BASENAME}.json`),
  }
}

export function detectExistingConfigDir(binary: OpenCodeBinaryType, version?: string | null): string | null {
  const locations: string[] = []
  const configBasename = binary === "mimocode" ? "mimocode" : "opencode"

  const envConfigDir = process.env[binary === "mimocode" ? "MIMOCODE_CONFIG_DIR" : "OPENCODE_CONFIG_DIR"]?.trim()
  if (envConfigDir) {
    locations.push(resolveConfigPath(envConfigDir))
  }

  if (binary === "mimocode") {
    const mimocodeHomeConfigDir = getMimocodeHomeConfigDir()
    if (mimocodeHomeConfigDir) {
      locations.unshift(mimocodeHomeConfigDir)
    }
  }

  if (binary === "opencode-desktop") {
    const identifier = isDevBuild(version) ? TAURI_APP_IDENTIFIER_DEV : TAURI_APP_IDENTIFIER
    locations.push(getTauriConfigDir(identifier))

    if (isDevBuild(version)) {
      locations.push(getTauriConfigDir(TAURI_APP_IDENTIFIER))
    }
  }

  locations.push(binary === "mimocode" ? getMimocodeConfigDir() : getCliConfigDir())

  for (const dir of locations) {
    const configJson = join(dir, `${configBasename}.json`)
    const configJsonc = join(dir, `${configBasename}.jsonc`)

    if (existsSync(configJson) || existsSync(configJsonc)) {
      return dir
    }
  }

  return null
}
