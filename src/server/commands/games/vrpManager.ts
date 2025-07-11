import * as fs from "fs";
import * as crypto from "node:crypto";
import { extractFull } from "node-7z";
import { join } from "path";

import settingsManager from "@commands/settings/manager";
import { downloadDir } from "@server/dirs";
import log from "@server/log";
import RunSystemCommand from "@server/systemProcess";
import HttpDownloader from "./downloader";
import vrpPublic from "./vrpPublic";

export interface GameInfo {
  name: string;
  releaseName: string;
  packageName: string;
  version: number;
  lastUpdated: string;
  size: string;
}

type CachedGameInfo = {
  lastDownloaded?: string;
  metadataHash?: string;
  games: GameInfo[];
};

const metaFileName = "meta.7z";
const metaFilePath = join(downloadDir, metaFileName);
const gamesInfoFileName = "games_info.json";
const vprFileName = "VRP-GameList.txt";

export class VprManager extends RunSystemCommand {
  private static METADATA_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours
  private static inited: boolean = false;

  private games: Map<string, GameInfo> = new Map();

  constructor() {
    super();
    void this.loadGamesInfo();
  }

  private get gamesFilePath(): string {
    return join(downloadDir, gamesInfoFileName);
  }

  private catchMetadataError(error: Error): void {
    log.error("Failed to update metadata. There is an issue with either your connection, or the server.", error);
  }

  public async loadGamesInfo(): Promise<boolean> {
    if (!fs.existsSync(this.gamesFilePath)) {
      log.warn(`${gamesInfoFileName} not found`);
    } else {
      log.debug(`Loading ${gamesInfoFileName}...`);

      const data = fs.readFileSync(this.gamesFilePath, "utf-8");
      const json = JSON.parse(data) as CachedGameInfo;
      const lastDownloaded = new Date(json.lastDownloaded || 0);

      if (!json || !Array.isArray(json.games)) {
        log.error("Invalid games_info.json");
      } else if (new Date().getTime() - lastDownloaded.getTime() > VprManager.METADATA_EXPIRATION_TIME) {
        log.warn("Games info is outdated");
      } else {
        this.games.clear();
        json.games.forEach(game => {
          this.games.set(game.releaseName, game);
        });

        log.userInfo("Games loaded from cache:", lastDownloaded);
        return true;
      }
    }

    await this.updateMetadata();
    log.userInfo("Games loaded successfully");

    return true;
  }

  public saveGamesInfo(): boolean {
    try {
      const games = Array.from(this.games.values());
      const json: CachedGameInfo = {
        lastDownloaded: new Date().toISOString(),
        // metadataHash: this.getHash(games),
        games,
      };
      fs.writeFileSync(this.gamesFilePath, JSON.stringify(json, null, 2), "utf-8");
      log.debug("games_info.json saved successfully");
      return true;
    } catch (error) {
      log.error("Failed to save games_info.json:", error);
      return false;
    }
  }

  private getHash(games: any): string {
    const json = JSON.stringify(games);
    const hash = crypto.createHash("sha256");
    hash.update(json);
    return hash.digest("hex");
  }

  public getGame(name: string): GameInfo | undefined {
    return this.games.get(name);
  }

  public async updateMetadata(): Promise<boolean> {
    const downloader = new HttpDownloader();
    const vrpInfo = await vrpPublic;
    if (!vrpInfo) {
      log.error("Failed to get VRP info");
      return false;
    }

    const downloaded = await downloader.downloadFile(metaFileName, vrpInfo?.baseUri, metaFilePath);

    if (!downloaded) {
      log.error("Failed to download metadata");
      return false;
    }

    const SevenZipPath = await this.getSevenZipPath();
    await new Promise((resolve, reject) => {
      log.debug("Extracting metadata...", SevenZipPath);
      const seven = extractFull(metaFilePath, downloadDir, {
        $bin: SevenZipPath,
        password: vrpInfo.password,
      });
      seven.on("end", function () {
        resolve(null);
      });

      seven.on("error", reject);
    });

    this.parseMetadata();
    await this.loadGamesInfo();
    return true;
  }

  public parseMetadata(): boolean {
    const filePath = join(downloadDir, vprFileName);

    if (!fs.existsSync(filePath)) {
      log.error(`${vprFileName} not found`);
      return false;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    lines.shift();

    this.games.clear();

    let isEmpty = true;

    for (const line of lines) {
      const parts = line.split(";");

      if (parts.length < 6) {
        log.error(`Invalid line in ${vprFileName}:`, line);
        continue;
      }

      const game: GameInfo = {
        name: parts[0],
        releaseName: parts[1],
        packageName: parts[2],
        version: Number.parseInt(parts[3]),
        lastUpdated: parts[4],
        size: parts[5],
      };

      this.games.set(game.releaseName, game);
      isEmpty = false;
    }

    this.saveGamesInfo();
    if (isEmpty) {
      log.error(`No games found in ${vprFileName}`);
      return false;
    } else {
      log.debug("Metadata parsed successfully");
      return true;
    }
  }

  public getDownloadedGames(): string[] {
    return fs.readdirSync(settingsManager.getDownloadsDir()).filter(file => fs.existsSync(join(settingsManager.getDownloadsDir(), file, "finished")));
  }
}

export default new VprManager();
