import { fetchQuranData } from "../../../cache";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const jsonData = await fetchQuranData();
    const ayahs = jsonData.data.filter((item) => item.surah.id === Number(id));

    return new Response(JSON.stringify({ status: "OK", data: ayahs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: "Error", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
