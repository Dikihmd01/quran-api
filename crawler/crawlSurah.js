const fs = require("fs");
const path = require("path");
require("dotenv").config();

const apiUrl = process.env.SOURCE_API_URL_SURAH;

// Function to pad surah_id and ayah_id to 3 digits
function padToThreeDigits(number) {
  return String(number).padStart(3, "0");
}

async function crawlData() {
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    // Loop through the data to add audio URLs dynamically
    const dataWithAudio = result.data.map((ayah) => {
      const surahId = padToThreeDigits(ayah.surah_id);
      const ayahId = padToThreeDigits(ayah.ayah);

      // Construct the audio URL based on surah_id and ayah_id
      const audioUrl = `${process.env.SOURCE_AUDIO_BASE_URL}/${surahId}${ayahId}.m4a`;

      // Add the audio URL after arabic_words
      return {
        ...ayah,
        audio_url: audioUrl, // Add the audio URL as a separate key
      };
    });

    // Define the path where the JSON file will be stored
    const dataDir = path.join(__dirname, "..", "data");
    const dataPath = path.join(dataDir, "surahWithAudio1.json");

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the modified data to the file
    fs.writeFileSync(
      dataPath,
      JSON.stringify({ data: dataWithAudio }, null, 2),
    );

    console.log(`Data with audio has been saved to ${dataPath}`);
  } catch (error) {
    console.error("Error fetching surah list:", error);
  }
}

// Run the function if called directly
if (require.main === module) {
  crawlData();
}

module.exports = crawlData;
