import { SpotifyPlaylist } from "../util/spotify/types";

/**
 * Gets nearest song relative
 * to the specifed time in the playlist,
 * uses days to measure distance.
 * If more than one song was
 * added on that day, it returns
 * an array of songs.
 */
export function getNearestSongs(time: number, playlist: SpotifyPlaylist) {
  const tracksWithTimeDiff = playlist.tracks.items.map((track) => {
    const diffMs = Math.abs(time - new Date(track.added_at).getTime());
    const diffDays = Math.round(diffMs / 1000 / 60 / 60 / 24);
    return {
      ...track,
      diffDays,
    };
  });
  tracksWithTimeDiff.sort((track1, track2) => {
    return track1.diffDays - track2.diffDays;
  });

  return tracksWithTimeDiff[0];
}
