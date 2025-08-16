const getLyrics = require("./getLyrics");
const getSong = require("./getSong");
const readline = require("readline");

const apiKey =
  "o4dFQpPnq-b7fQ6eo9YeYYxkCq-KvAUsdr6XMZVPj2Q94fxQT-ttIhsl8SPQgqxn";

// create user interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter song title: ", (title) => {
  rl.question("Enter artist name: ", (artist) => {
    getLyrics({ apiKey, title, artist }).then((lyrics) => console.log(lyrics));
    getSong({ apiKey, title, artist }).then((song) =>
      console.log(`${song.title} by ${song.artist}`)
    );
  });
});
