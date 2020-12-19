import { useEffect, useState } from "react";

interface UseSpotifyPlaylistParams {
  accessToken?: string;
  playlistId: string;
}

export default function useSpotifyPlaylist({
  accessToken,
  playlistId,
}: UseSpotifyPlaylistParams) {
  const [playlist, setPlaylist] = useState<any>();

  useEffect(() => {
    let didCancel = false;

    async function fetchPlaylist() {
      if (accessToken) {
        const data = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ).then((res) => res.json());
        if (!didCancel) {
          setPlaylist(data);
        }
      }
    }

    fetchPlaylist();

    return () => {
      didCancel = true;
    };
  }, [playlistId, accessToken]);

  return playlist;
}
