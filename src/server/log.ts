const MAX_LOG_COMMAND_OUTPUT_LINES = 20;
let shouldDebugCommands = false;
let shouldDebug = false;
let shouldWarn = false;
let shouldInfo = false;

const isVerbose = process.argv.includes("--log:verbose");
if (isVerbose) {
  shouldDebugCommands = true;
}
if (shouldDebugCommands || process.argv.includes("--log:debug")) {
  shouldDebug = true;
}
if (shouldDebug || process.argv.includes("--log:info")) {
  shouldInfo = true;
}
if (shouldInfo || process.argv.includes("--log:warn")) {
  shouldWarn = true;
}

class UserLogger {
  private lastLogType: string | null = null;

  public userInfo = (...args: any[]) => this.log("userInfo", "\x1b[33m", ...args, "\x1b[0m");

  public error = (...args: any[]) => this.log("error", "\x1b[31m", ...args, "\x1b[0m");

  public commandError = (command: string, args: string[], error: string) => {
    this.log(
      "commandError",
      "\x1b[31m<----------------------------------------",
      `\nCommand '${command} ${args.join(" ")}' executed with error:`,
      "\n" + error,
      "\n---------------------------------------->\x1b[0m"
    );
  };

  protected log(type: string, ...args: any[]) {
    if (this.lastLogType !== type) {
      console.log("");
    }

    this.lastLogType = type;
    console.log(...args);
  }
}

class DevLogger extends UserLogger {
  constructor() {
    super();
    this.info("Log level set to:", { shouldDebugCommands, shouldDebug, shouldWarn, shouldInfo });
  }

  public warn = (...args: any[]) => shouldWarn && this.log("warn", "\x1b[33m", ...args, "\x1b[0m");

  public info = (...args: any[]) => shouldInfo && this.log("info", ...args, "");

  public debug = (...args: any[]) =>
    shouldDebug && this.log("debug", "\x1b[35m", ...args, "\x1b[0m");

  public command = (command: string, args: string[], stdout: string, stderr: string) => {
    if (!shouldDebugCommands) return;
    const stdoutLines = stdout.split("\n");
    this.log(
      "command",
      "\x1b[32m---------------------------------------->",
      `\n\x1b[32mExecuting command: \x1b[33m'${command} ${args.join(" ")}'\x1b[0m`,
      "\n\x1b[32m<----------------------------------------",
      `\nCommand \x1b[33m'${command} ${args.join(" ")}'\x1b[32m executed\nstdout:\x1b[0m`,
      "\n\x1b[34m" + stdoutLines.slice(0, MAX_LOG_COMMAND_OUTPUT_LINES).join("\n") + "\x1b[0m",
      stdoutLines.length > 20
        ? `\n...and ${stdoutLines.length - MAX_LOG_COMMAND_OUTPUT_LINES} more lines`
        : "",
      stderr ? "\n\x1b[31mWith stderr: \n" + stderr + "\x1b[0m" : "",
      "\n\x1b[32m---------------------------------------->\x1b[0m"
    );
  };
}

export default new DevLogger();
