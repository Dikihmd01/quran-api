import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Path to the crawled JSON file
    const filePath = path.join(process.cwd(), "data", "surahWithAudio.json");

    // Read the file contents
    const fileContents = await fs.readFile(filePath, "utf8");

    // Parse the JSON data
    const jsonData = JSON.parse(fileContents);

    // Use a Map to ensure each surah is unique by its id
    const surahMap = new Map();

    jsonData.data.forEach((ayah) => {
      const surah = ayah.surah;
      // Add surah to the map if it's not exists
      if (!surahMap.has(surah.id)) {
        surahMap.set(surah.id, surah);
      }
    });

    // Convert the map values to an array
    const uniqueSurahs = Array.from(surahMap.values());

    // Prepare the response object
    const responseObject = {
      code: 200,
      status: "OK.",
      message: "Success fetching all surah.",
      data: uniqueSurahs,
    };

    // Return the transformed JSON response
    return new Response(JSON.stringify(responseObject), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error reading surah data:", error);

    // Prepare the error response object
    const errorResponse = {
      code: 500,
      status: "Error",
      message: "Failed to read surah data",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
