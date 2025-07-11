import type { CommandSender, GameStatusInfo } from "@server/commands/types";

import ElectronBridge from "./ElectronBridge";
import WebSocketBridge from "./WebSocketbridge";

export interface BridgeInterface {
  sendCommand: CommandSender;
  registerGameStatusReceiver: (callback: (info: GameStatusInfo) => void) => void;
}

export const isElectron = !!window.sendCommand;
export const isWebsocket = !isElectron;
export const bridge: BridgeInterface = isElectron ? new ElectronBridge() : new WebSocketBridge();

export default bridge;

declare global {
  interface Window {
    sendCommand: CommandSender;
    downloads: {
      receive: (callback: (info: GameStatusInfo) => void) => void;
    };
  }
}
