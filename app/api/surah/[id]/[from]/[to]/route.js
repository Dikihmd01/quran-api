export async function GET(request, { params }) {
  const { id, from, to } = params;

  // Convert from and to to integers
  const start = parseInt(from, 10);
  const end = parseInt(to, 10);

  // Adjust the start and end to be 0-based for external API
  const apiStart = start - 1;
  const apiEnd = end - 1;

  // Calculate limit
  const limit = apiEnd - apiStart + 1;

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

  // Construct API URL with adjusted start and limit
  const apiUrl = `${process.env.SOURCE_API_URL_SURAH}?start=${apiStart}&limit=${limit}&surah=${id}`;
  const audioBaseUrl = process.env.SOURCE_AUDIO_BASE_URL;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if data is in expected format
    if (!Array.isArray(data.data)) {
      throw new Error("Data is not in the expected format");
    }

    // Add audio URL to each ayah
    const ayahsWithAudio = data.data.map((ayah) => {
      const ayahNumberPadded = String(ayah.ayah).padStart(3, "0");
      const audioUrl = `${audioBaseUrl}${id.padStart(3, "0")}${ayahNumberPadded}.m4a`;

      return {
        ...ayah,
        surah: {
          ...ayah.surah,
          audio: audioUrl,
        },
      };
    });

    return new Response(JSON.stringify(ayahsWithAudio), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Error fetching surah ${id} from ${from} to ${to}:`, error);
    return new Response(
      JSON.stringify({
        error: `Failed to fetch surah ${id} from ${from} to ${to}`,
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
