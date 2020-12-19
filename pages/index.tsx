import { redirectToSpotifyLogin } from "../browser/util/spotify";
import useSpotifyPlaylist from "../browser/util/spotify/useSpotifyPlaylist";
import useSpotifyAcessToken from "../browser/util/spotify/useSpotifyAcessToken";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
if (!clientId)
  throw new Error("process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID not defined");

const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
if (!playlistId)
  throw new Error("process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID not defined");

function onSpotifyLogin() {
  redirectToSpotifyLogin({ clientId });
}

export default function Home() {
  const { accessToken } = useSpotifyAcessToken();
  const playlist = useSpotifyPlaylist({ accessToken, playlistId });
  console.log({ playlist });

  return (
    <main>
      <button onClick={onSpotifyLogin}>Spotify Login</button>
    </main>
  );
}
