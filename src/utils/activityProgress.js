import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFile = path.resolve(__dirname, "activityProgress.json");

async function saveProgress(index) {
  await fs.writeFile(progressFile, JSON.stringify({ index }), "utf-8");
}

// async function loadProgress() {
//   if (fs.existsSync(progressFile)) {
//     try {
//       const data = fs.readFileSync(progressFile, "utf-8");
//       const obj = JSON.parse(data);
//       return typeof obj.index === "number" ? obj.index : 0;
//     } catch {
//       return 0;
//     }
//   }
//   return 0;
// }
async function loadProgress() {
  try {
    // 1. Check if the file exists using access
    await fs.access(progressFile);

    // 2. Read the file
    const data = await fs.readFile(progressFile, "utf-8");
    const obj = JSON.parse(data);

    // 3. Robust check: ensure it's a number and not "-" or NaN
    const index = Number(obj.index);
    return Number.isFinite(index) ? index : 0;
  } catch (error) {
    // Returns 0 if file doesn't exist or JSON is malformed
    return 0;
  }
}
const FAILED_RECORDS_PATH = path.join(
  __dirname,
  "failedCollectionsactivity.json"
);

/**
 * Saves a collection ID under a specific key (e.g., 'work_orders')
 * @param {string} key - The category or collection name
 * @param {string|number} collectionId
 */
async function saveFailedCollectionId(key, collectionId) {
  try {
    let failedData = {};

    // 1. Read existing data
    try {
      const data = await fs.readFile(FAILED_RECORDS_PATH, "utf8");
      failedData = JSON.parse(data);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    // 2. Initialize the key if it doesn't exist
    if (!failedData[key]) {
      failedData[key] = [];
    }

    // 3. Add ID only if it's not already in that specific key's list
    if (!failedData[key].includes(collectionId)) {
      failedData[key].push(collectionId);

      // 4. Write back to file
      await fs.writeFile(
        FAILED_RECORDS_PATH,
        JSON.stringify(failedData, null, 2)
      );

      logger.info(`Recorded failure for ${key}: ${collectionId}`);
    }
  } catch (error) {
    logger.error(
      `Critical: Could not save failed ID ${collectionId} for key ${key}`,
      error
    );
  }
}
export { saveProgress, loadProgress, saveFailedCollectionId };
