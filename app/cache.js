import fs from 'fs';
import path from 'path';

let cachedData = null;

export async function fetchQuranData() {
  if (!cachedData) {
    // Get the directory and file name from environment variables
    const dataDir = process.env.DB_DIR;
    const dataFile = process.env.DB_FILE;

    if (!dataDir || !dataFile) {
      throw new Error("Environment variables DB_DIR and DB_FILE must be defined.");
    }

    // Construct the full path to the JSON file
    const dataPath = path.join(process.cwd(), dataDir, dataFile);

    try {
      // Read the JSON file synchronously
      const jsonData = fs.readFileSync(dataPath, 'utf8');
      
      // Parse the JSON data
      cachedData = JSON.parse(jsonData);
    } catch (error) {
      throw new Error("Failed to read data from the JSON file: " + error.message);
    }
  }

  return cachedData;
}
