import { useEffect, useState } from "react";

let isSpotifySdkReady = false;

if (typeof window !== "undefined") {
  window.onSpotifyWebPlaybackSDKReady = () => {
    isSpotifySdkReady = true;
  };
}

function loadWebPlayer() {
  return new Promise<typeof Spotify.Player>(async (resolve, reject) => {
    function resolveIfReady() {
      if (isSpotifySdkReady) {
        resolve(Spotify.Player);
        return true;
      }
      return false;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.type = "text/javascript";
    script.addEventListener("load", () => {
      if (!resolveIfReady()) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve(Spotify.Player);
        };
      }
    });
    document.body.appendChild(script);
  });
}

interface UseWebPlayerParams {
  accessToken?: string;
}

export function useWebPlayer({ accessToken }: UseWebPlayerParams) {
  const [WebPlayer, setWebPlayerClass] = useState<typeof Spotify.Player>();
  const [player, setPlayer] = useState<Spotify.SpotifyPlayer>();
  const [error, setError] = useState<string>();

  async function play(spotifyUri: string) {
    if (accessToken && player) {
      const playerId = (player as any)._options.id;
      return fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [spotifyUri] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
  }

  useEffect(() => {
    let didCancel = false;
    if (WebPlayer && accessToken) {
      const player = new WebPlayer({
        getOAuthToken: (cb) => cb(accessToken),
        name: "Our player",
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
        setError(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
        setError(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
        setError(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
        setError(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state) => {
        console.log(state);
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("[Spotify] Ready with Device ID", device_id);
        if (!didCancel) {
          setPlayer(player);
        }
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("[Spotify] Device ID has gone offline", device_id);
      });

      player.connect();

      return () => {
        didCancel = true;
      };
    }
  }, [WebPlayer, accessToken]);

  useEffect(() => {
    let didCancel = false;
    if (WebPlayer) return;
    (async () => {
      const Player = await loadWebPlayer();
      if (!didCancel) {
        setWebPlayerClass(() => Player);
      }
    })();

    return () => {
      didCancel = true;
    };
  }, [WebPlayer]);

  return { loading: !player, error, play };
}
