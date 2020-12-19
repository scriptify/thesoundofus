import { redirectToSpotifyLogin } from "../browser/util/spotify";
import useSpotifyPlaylist from "../browser/util/spotify/useSpotifyPlaylist";
import { useWebPlayer } from "../browser/util/spotify/useWebPlayer";
import { redirectToGoogleLogin } from "../browser/util/google";
import useAccessToken from "../browser/util/useAccessToken";
import useGooglePhotosAlbum from "../browser/util/google/useGooglePhotosAlbum";

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

function onSpotifyLogin() {
  redirectToSpotifyLogin({ clientId: spotifyClientId });
}

function onGoogleLogin() {
  redirectToGoogleLogin({ clientId: googleClientId });
}

export default function Home() {
  const { accessToken, type } = useAccessToken();
  const playlist = useSpotifyPlaylist({
    accessToken: type === "spotify" ? accessToken : undefined,
    playlistId,
  });
  const { play, loading: playerLoading } = useWebPlayer({
    accessToken: type === "spotify" ? accessToken : undefined,
  });

  const album = useGooglePhotosAlbum({
    accessToken: type === "google" ? accessToken : undefined,
    albumId,
  });

  console.log({ album });

  function onPlayRandom() {
    if (!playerLoading && playlist) {
      const trackUri = playlist.tracks.items[0].track.uri;
      play(trackUri);
    }
  }

  return (
    <main>
      <button onClick={onSpotifyLogin}>Spotify Login</button>
      <button onClick={onGoogleLogin}>Google Login</button>
      <button onClick={onPlayRandom}>Play</button>
    </main>
  );
}
