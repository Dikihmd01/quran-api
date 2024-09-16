export async function GET() {
  const apiUrl = process.env.SOURCE_API_URL_ALL_SURAH;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching surah list:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch surah list" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
