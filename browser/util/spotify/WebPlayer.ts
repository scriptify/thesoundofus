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

interface SpotifyWebPlayerParams {
  accessToken: string;
  onError: (e: string) => any;
}

export default class SpotifyWebPlayer {
  private player?: Spotify.SpotifyPlayer;
  private options: SpotifyWebPlayerParams;
  private deviceId?: string;

  constructor(options: SpotifyWebPlayerParams) {
    this.options = options;
  }

  public pause() {
    this.player?.pause();
  }

  public async load() {
    const WebPlayer = await loadWebPlayer();
    const player = new WebPlayer({
      getOAuthToken: (cb) => cb(this.options.accessToken),
      name: "The Sound of Us",
    });
    this.player = player;

    return new Promise((resolve) => {
      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
        this.options.onError(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
        this.options.onError(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
        this.options.onError(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
        this.options.onError(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state) => {
        console.log(state);
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        this.deviceId = device_id;
        console.log("[Spotify] Ready with Device ID", device_id);
        resolve(true);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("[Spotify] Device ID has gone offline", device_id);
      });

      player.connect();
    });
  }

  public play(songId: string) {
    return fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
      {
        method: "PUT",
        body: JSON.stringify({ uris: [songId] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options.accessToken}`,
        },
      }
    );
  }
}
