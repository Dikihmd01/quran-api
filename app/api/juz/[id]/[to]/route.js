import { fetchQuranData } from "../../../../cache";

export async function GET(request, { params }) {
  const { id, to } = params;

  try {
    const jsonData = await fetchQuranData();

    // Convert params to numbers
    const idJuz = Number(id);
    const toJuz = Number(to);

    // Filter data to get all ayahs in the specified juz range
    const ayahs = jsonData.data.filter(item => 
      item.juz >= idJuz && item.juz <= toJuz
    );

    if (ayahs.length > 0) {
      return new Response(JSON.stringify({
        code: 200,
        status: "OK",
        message: `Success fetching ayahs from Juz ${id} to ${to}.`,
        data: ayahs,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({
        code: 404,
        status: "Not Found",
        message: `No ayahs found for juz range ${id} to ${to}.`,
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(`Error reading ayahs for juz range ${id} to ${to}:`, error);
    return new Response(JSON.stringify({
      code: 500,
      status: "Error",
      message: `Failed to read ayahs for juz range ${id} to ${to}: ${error.message}`,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
