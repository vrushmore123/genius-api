const fs = require("fs");
const play = require("play-dl");
const getLyrics = require("./getLyrics");
const getSong = require("./getSong");
const ytdl = require("@distube/ytdl-core"); // updated fork

const apiKey = "o4dFQpPnq-b7fQ6eo9YeYYxkCq-KvAUsdr6XMZVPj2Q94fxQT-ttIhsl8SPQgqxn";

async function fetchLyricsAndAudio(title, artist) {
    const options = {
        apiKey,
        title,
        artist,
        optimizeQuery: true,
    };

    // 1️⃣ Fetch Lyrics
    try {
        const lyrics = await getLyrics(options);
        if (lyrics) {
            console.log("\n🎵 Lyrics:\n", lyrics);
        } else {
            console.log("❌ Lyrics not found");
        }
    } catch (err) {
        console.error("Error fetching lyrics:", err.message);
    }

    // 2️⃣ Fetch Song Info
    try {
        const song = await getSong(options);
        console.log(`\n✅ Found: ${song.title} by ${song.artist}`);
    } catch (err) {
        console.error("Error fetching song info:", err.message);
    }

    // 3️⃣ Search YouTube and Download Audio
    try {
        const ytResults = await play.search(`${title} ${artist}`, { limit: 5 });
        const video = ytResults.find(v => v.type === "video" && v.url);
        if (!video) {
            console.log("❌ No valid YouTube video found");
            return;
        }

        console.log(`\n📽️ Found video: ${video.title}`);
        console.log(`🔗 URL: ${video.url}`);

        const fileName = `${title}-${artist}.mp3`;
        const stream = ytdl(video.url, {
            filter: "audioonly",
            quality: "highestaudio"
        });

        stream.pipe(fs.createWriteStream(fileName))
            .on("finish", () => console.log(`✅ Audio saved as ${fileName}`))
            .on("error", err => console.error("Stream error:", err.message));

    } catch (err) {
        console.error("Error downloading audio:", err.message);
    }
}

// Example usage
fetchLyricsAndAudio("Shape of You", "Ed Sheeran");
