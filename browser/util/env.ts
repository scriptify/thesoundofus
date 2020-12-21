const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
if (!spotifyClientId)
  throw new Error("process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID not defined");

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!googleClientId)
  throw new Error("process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID not defined");

const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
if (!playlistId)
  throw new Error("process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID not defined");

const albumId = process.env.NEXT_PUBLIC_GOOGLE_ALBUM_ID;
if (!albumId)
  throw new Error("process.env.NEXT_PUBLIC_GOOGLE_ALBUM_ID not defined");

const env = {
  spotifyClientId,
  googleClientId,
  playlistId,
  albumId,
};

export default env;
