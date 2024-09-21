import { fetchQuranData } from "../../../cache";
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const jsonData = await fetchQuranData();

    // Filter data to get all ayahs in the specified juz
    const ayahs = jsonData.data.filter(item => item.juz === Number(id));

    if (ayahs.length > 0) {
      return new Response(JSON.stringify({
        code: 200,
        status: "OK",
        message: `Success fetching ayahs for juz ${id}.`,
        data: ayahs,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({
        code: 404,
        status: "Not Found",
        message: `No ayahs found for juz with ID ${id}.`,
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(`Error reading ayahs for juz ${id}:`, error);
    return new Response(JSON.stringify({
      code: 500,
      status: "Error",
      message: `Failed to read ayahs for juz ${id}: ${error.message}`,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
