import { SpotifyPlaylist } from "../util/spotify/types";

/**
 * Gets nearest song relative
 * to the specifed time in the playlist
 */
export function getNearestSong(time: number, playlist: SpotifyPlaylist) {
  const sorted = [...playlist.tracks.items];
  sorted.sort((track1, track2) => {
    const diff1 = Math.abs(time - new Date(track1.added_at).getTime());
    const diff2 = Math.abs(time - new Date(track2.added_at).getTime());

    return diff1 - diff2;
  });

  return sorted[0];
}
