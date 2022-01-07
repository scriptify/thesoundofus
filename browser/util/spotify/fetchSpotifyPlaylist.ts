import { SpotifyPlaylist } from "./types";

type Tracks = SpotifyPlaylist["tracks"];

interface FetchAllTracks {
  nextLink: string;
  accessToken: string;
  tracks: SpotifyPlaylist["tracks"]["items"];
}

async function fetchAllTracks({
  nextLink,
  accessToken,
  tracks,
}: FetchAllTracks): Promise<SpotifyPlaylist["tracks"]["items"]> {
  const nextPlaylistPage = await fetch(nextLink, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
  const newArr = [...tracks, ...nextPlaylistPage.items];
  if (nextPlaylistPage.next) {
    return fetchAllTracks({
      nextLink: nextPlaylistPage.next,
      accessToken,
      tracks: newArr,
    });
  }
  return newArr;
}

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

  const data = (await req.json()) as SpotifyPlaylist;
  if (data.tracks.next) {
    const allTracks = await fetchAllTracks({
      nextLink: data.tracks.next,
      accessToken,
      tracks: data.tracks.items,
    });
    data.tracks.items = allTracks;
  }
  return data;
}
