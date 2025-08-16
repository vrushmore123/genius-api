const fs = require("fs");

const readline = require("readline");
const play = require("play-dl");
const getLyrics = require("./getLyrics");
const getSong = require("./getSong");
const ytdl = require("@distube/ytdl-core"); // updated fork

const apiKey = "o4dFQpPnq-b7fQ6eo9YeYYxkCq-KvAUsdr6XMZVPj2Q94fxQT-ttIhsl8SPQgqxn";

async function fetchLyricsAndKaraoke(title, artist) {
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

    // 3️⃣ Search YouTube for Karaoke Version
    try {
        const searchQuery = `${title} ${artist} karaoke`; // force karaoke search
        const ytResults = await play.search(searchQuery, { limit: 10 });

        const video = ytResults.find(v =>
            v.type === "video" &&
            v.url &&
            /karaoke|instrumental/i.test(v.title) // ensure it's karaoke
        );

        if (!video) {
            console.log("❌ No karaoke version found");
            return;
        }

        console.log(`\n📽️ Found karaoke video: ${video.title}`);
        console.log(`🔗 URL: ${video.url}`);

        const fileName = `karaoke-${title}-${artist}.mp3`;
        const stream = ytdl(video.url, {
            filter: "audioonly",
            quality: "highestaudio"
        });

        stream.pipe(fs.createWriteStream(fileName))
            .on("finish", () => console.log(`✅ Karaoke audio saved as ${fileName}`))
            .on("error", err => console.error("Stream error:", err.message));

    } catch (err) {
        console.error("Error downloading karaoke audio:", err.message);
    }
}

// CLI Input Handling
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("🎤 Enter song title: ", (title) => {
    rl.question("🎼 Enter artist name: ", (artist) => {
        fetchLyricsAndKaraoke(title, artist);
        rl.close();
    });
});
