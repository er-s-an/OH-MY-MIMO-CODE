import { getRuntimeCliBinary } from "../../harness-runtime"
import { shellEscapeForDoubleQuotedCommand } from "../../shell-env"

const TMUX_COMMAND_SHELL = "/bin/sh"

export function buildTmuxAttachCommand(serverUrl: string, sessionId: string, directory: string = process.cwd()): string {
  const cliBinary = getRuntimeCliBinary()
  const escapedUrl = shellEscapeForDoubleQuotedCommand(serverUrl)
  const escapedSessionId = shellEscapeForDoubleQuotedCommand(sessionId)
  const escapedDirectory = shellEscapeForDoubleQuotedCommand(directory || process.cwd())
  return `${TMUX_COMMAND_SHELL} -c "${cliBinary} attach ${escapedUrl} --session ${escapedSessionId} --dir ${escapedDirectory}"`
}

export function buildTmuxPlaceholderCommand(description: string): string {
  const escapedDescription = shellEscapeForDoubleQuotedCommand(description)
  return `${TMUX_COMMAND_SHELL} -c "printf '%s\\n%s\\n' \\"OMO subagent pane ready: ${escapedDescription}\\" \\"Focus this pane to attach.\\"; while :; do sleep 86400; done"`
}
