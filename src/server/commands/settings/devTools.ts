import { Command, CommandEvent } from "@commands/types";

export type DevToolsCommandName = "devTools";
export type DevToolsCommand = Command<void, void, DevToolsCommandName>;
export type DevToolsCommandEvent = CommandEvent<void, DevToolsCommandName>;

export default {
  type: "devTools",
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  receiver: function () {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { BrowserWindow } = require("electron");

    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      if (focusedWindow.webContents.isDevToolsOpened()) {
        focusedWindow.webContents.closeDevTools();
      } else {
        focusedWindow.webContents.openDevTools();
      }
    }
  },
} as DevToolsCommand;
