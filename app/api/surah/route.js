import { fetchQuranData } from "../../cache";

export async function GET(req) {
  try {
    const { data } = await fetchQuranData();

    const surahMap = new Map();
    data.forEach((ayah) => {
      const surah = ayah.surah;
      if (!surahMap.has(surah.id)) {
        surahMap.set(surah.id, surah);
      }
    });

    const uniqueSurahs = Array.from(surahMap.values());

    return new Response(
      JSON.stringify({
        code: 200,
        status: "OK",
        message: `Success fetching all surah`,
        data: uniqueSurahs,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "Error", message: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
