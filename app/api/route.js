export async function GET() {
  const apiInfo = {
    surah: {
      listSurah: "/surah",
      spesificSurah: {
        pattern: "/surah/{surah}",
        example: "/surah/18"
      },
      spesificAyahInSurah: {
        pattern: "/surah/{surah}/{ayah}",
        example: "/surah/18/60"
      },
    },
    maintaner: "Diki Hamdani",
  };

  return new Response(JSON.stringify(apiInfo), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
