import getLyrics from "../../lyrics.js"; // import your helper

export async function handler(event, context) {
  try {
    const { title, artist } = event.queryStringParameters;

    if (!title || !artist) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing title or artist" }),
      };
    }

    const options = {
      apiKey: process.env.GENIUS_API_KEY, // store your key in Netlify env vars
      title,
      artist,
      optimizeQuery: true,
    };

    const lyrics = await getLyrics(options);

    if (!lyrics) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Lyrics not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ lyrics }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
