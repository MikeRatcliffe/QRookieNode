import type { BridgeInterface } from ".";

export default class ElectronBridge implements BridgeInterface {
  public sendCommand = window.sendCommand;
  public registerGameStatusReceiver = window.downloads.receive;
}
