import { fetchQuranData } from "../../../../../cache";

export async function GET(request, { params }) {
  const { id, from, to } = params;
  const start = parseInt(from, 10);
  const end = parseInt(to, 10);

  if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
    return new Response(JSON.stringify({ error: "Invalid 'from' or 'to' parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const jsonData = await fetchQuranData();
    const ayahs = jsonData.data.filter(
      (item) => item.surah.id === Number(id) && item.ayah >= start && item.ayah <= end
    );

    return new Response(JSON.stringify({ 
      code: 200,
      status: "OK",
      message: `Success fetching surah ${id} from ayah ${from} to ${to}.`,
      data: ayahs 
    }), {
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
