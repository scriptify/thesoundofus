import { redirectToSpotifyLogin } from "../browser/util/spotify";
import { redirectToGoogleLogin } from "../browser/util/google";
import env from "../browser/util/env";
import { observer } from "mobx-react-lite";
import rootStore from "../browser/state/RootStore";

function onSpotifyLogin() {
  redirectToSpotifyLogin({ clientId: env.spotifyClientId });
}

function onGoogleLogin() {
  redirectToGoogleLogin({ clientId: env.googleClientId });
}

function Home() {
  // function onPlayRandom() {
  //   if (!playerLoading && playlist) {
  //     const trackUri = playlist.tracks.items[0].track.uri;
  //     play(trackUri);
  //   }
  // }

  return (
    <main>
      {!rootStore.spotifyAccessToken && (
        <button onClick={onSpotifyLogin}>Spotify Login</button>
      )}
      {!rootStore.googleAccessToken && (
        <button onClick={onGoogleLogin}>Google Login</button>
      )}
    </main>
  );
}

export default observer(Home);
