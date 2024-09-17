import { promises as fs } from "fs";
import path from "path";

export async function GET(request, { params }) {
  const { id, from, to } = params;

  // Convert from and to to integers
  const start = parseInt(from, 10);
  const end = parseInt(to, 10);

  // Ensure valid values
  if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
    return new Response(
      JSON.stringify({ error: "Invalid 'from' or 'to' parameters" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const filePath = path.join(process.cwd(), "data", "surahWithAudio.json");

  try {
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(fileContents);

    // Filter data to get ayahs for the given surah id and range
    const ayahs = jsonData.data.filter(
      (item) =>
        item.surah_id === Number(id) && item.ayah >= start && item.ayah <= end,
    );

    if (ayahs.length > 0) {
      // Prepare the response object
      const responseObject = {
        code: 200,
        status: "OK.",
        message: `Success fetching ayahs from ${start} to ${end} for surah ${id}.`,
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
          message: `No ayahs found for surah with ID ${id} from ${start} to ${end}.`,
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
    console.error(
      `Error reading ayahs for surah ${id} from ${from} to ${to}:`,
      error,
    );
    return new Response(
      JSON.stringify({
        code: 500,
        status: "Error",
        message: `Failed to read ayahs for surah ${id} from ${from} to ${to}: ${error.message}`,
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
