import { promises as fs } from "fs";
import path from "path";

export async function GET(request, { params }) {
  const { id } = params;
  const filePath = path.join(process.cwd(), "data", "surahWithAudio.json");

  try {
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(fileContents);

    // Filter data to get all ayahs for the given surah id
    const ayahs = jsonData.data.filter((item) => item.surah.id === Number(id));

    if (ayahs.length > 0) {
      // Prepare the response object
      const responseObject = {
        code: 200,
        status: "OK.",
        message: `Success fetching all ayahs for surah ${id}.`,
        data: ayahs,
      };

      return new Response(JSON.stringify(responseObject), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle case where no ayahs are found for the surah
      return new Response(
        JSON.stringify({
          code: 404,
          status: "Not Found",
          message: `No ayahs found for surah with ID ${id}.`,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error(`Error reading ayahs for surah ${id}:`, error);
    return new Response(
      JSON.stringify({
        code: 500,
        status: "Error",
        message: `Failed to read ayahs for surah ${id}: ${error.message}`,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
