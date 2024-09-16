export async function GET(request, { params }) {
  const { id } = params;
  const apiUrl = `${process.env.SOURCE_API_URL_SURAH}?surah=${id}`;
  const audioBaseUrl = process.env.SOURCE_AUDIO_BASE_URL;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      // Add audio URL to each surah object
      const updatedData = {
        ...data,
        data: data.data.map((item) => {
          // Pad the surah ID to 3 digits
          const surahIdPadded = String(item.surah_id).padStart(3, "0");
          // Pad ayah number to 3 digits
          const ayahNumberPadded = String(item.ayah).padStart(3, "0");
          // Construct audio URL
          const audioUrl = `${audioBaseUrl}${surahIdPadded}${ayahNumberPadded}.m4a`;

          return {
            ...item,
            surah: {
              ...item.surah,
              // Add the audio URL to the surah object
              audio: audioUrl,
            },
          };
        }),
      };

      return new Response(JSON.stringify(updatedData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      throw new Error("Data does not contain a valid array");
    }
  } catch (error) {
    console.error(`Error fetching surah ${id}:`, error);
    return new Response(
      JSON.stringify({
        error: `Failed to fetch surah ${id}: ${error.message}`,
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
