import { existsSync } from "fs";
import { join } from "path";

import { downloadDir, resourcesDir } from "@server/dirs";
import log from "@server/log";

export const getImagePath = (packageName: string) => {
  let filePath = join(downloadDir, ".meta", "thumbnails", packageName + ".jpg");
  if (!existsSync(filePath)) {
    filePath = join(resourcesDir, "assets/images/matrix.png");
    log.info(`Image for package "${packageName}" not found, using default image at ${filePath}`);
  }
  return filePath;
};
