// lib/server.js
const express = require("express");
const play = require("play-dl");
const ytdl = require("@distube/ytdl-core");
const getLyrics = require("./getLyrics");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/karaoke", async (req, res) => {
  const { title, artist } = req.query;
  const searchQuery = `${title} ${artist} karaoke`;

  try {
    const ytResults = await play.search(searchQuery, { limit: 5 });
    const video = ytResults.find(
      (v) => v.type === "video" && /karaoke|instrumental/i.test(v.title)
    );

    if (!video) {
      return res.status(404).send("Karaoke version not found");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${title}-${artist}-karaoke.mp3"`
    );
    ytdl(video.url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.get("/lyrics", async (req, res) => {
	try {
		const { title, artist } = req.query;

		if (!title || !artist) {
			return res.status(400).json({ error: "Missing title or artist" });
		}

		console.log(`🎵 Fetching lyrics for: ${title} by ${artist}`);

		const lyrics = await getLyrics({
			apiKey: "o4dFQpPnq-b7fQ6eo9YeYYxkCq-KvAUsdr6XMZVPj2Q94fxQT-ttIhsl8SPQgqxn",
			title: title,
			artist: artist,
			optimizeQuery: true,
		});

		if (!lyrics) {
			return res.status(404).json({ error: "Lyrics not found" });
		}

		res.json({ lyrics });
	} catch (err) {
		console.error("❌ Error in /lyrics route:", err); // ✅ This will show the actual cause
		res.status(500).json({ error: "Internal Server Error", details: err.message });
	}
});


app.listen(3000, () =>
  console.log("🎶 Karaoke server running at http://localhost:3000")
);
