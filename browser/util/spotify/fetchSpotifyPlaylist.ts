import { SpotifyPlaylist } from "./types";

interface FetchSpotifyPlaylistParams {
  accessToken: string;
  playlistId: string;
}

export default async function fetchSpotifyPlaylist({
  accessToken,
  playlistId,
}: FetchSpotifyPlaylistParams): Promise<SpotifyPlaylist> {
  const req = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (req.status !== 200) {
    throw new Error(req.status.toString());
  }

  const data = await req.json();

  return data;

  return data;
}
