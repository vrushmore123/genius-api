import play from "play-dl";
import getLyrics from "./getLyrics.js";
import getSong from "./getSong.js";

export async function handler(event, context) {
  try {
    const { title, artist } = event.queryStringParameters;

    if (!title || !artist) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing title or artist" }),
      };
    }

    const options = { title, artist, optimizeQuery: true };

    // 1️⃣ Lyrics
    let lyrics = null;
    try {
      lyrics = await getLyrics(options);
    } catch (e) {
      lyrics = "❌ Lyrics not found";
    }

    // 2️⃣ Song Info
    let songInfo = null;
    try {
      songInfo = await getSong(options);
    } catch (e) {
      songInfo = { error: "❌ Song info not found" };
    }

    // 3️⃣ Karaoke Search on YouTube
    const searchQuery = `${title} ${artist} karaoke`;
    const ytResults = await play.search(searchQuery, { limit: 10 });

    const video = ytResults.find(
      (v) => v.type === "video" && /karaoke|instrumental/i.test(v.title)
    );

    if (!video) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No karaoke version found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        lyrics,
        songInfo,
        karaoke: {
          title: video.title,
          url: video.url,
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
