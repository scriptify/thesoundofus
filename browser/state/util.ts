import { Album } from "../util/google/types";
import { SpotifyPlaylist } from "../util/spotify/types";
import { PhotoWithSong } from "./types";

function getNearestPhoto(
  time: number,
  photos: PhotoWithSong[],
  predicate: (p: PhotoWithSong) => boolean
) {
  const sorted = [...photos];
  sorted.sort((photo1, photo2) => {
    const diff1 = Math.abs(
      time - new Date(photo1.mediaMetadata.creationTime).getTime()
    );
    const diff2 = Math.abs(
      time - new Date(photo2.mediaMetadata.creationTime).getTime()
    );
    return diff1 - diff2;
  });

  return sorted.find(predicate);
}

/**
 * For each track, find the nearest photo,
 * and assign the photo to the track.
 * The goal isn't maximum precision,
 * but to have a high song <> photo variation
 * and a lot of "Oh I know that song!!" moments.
 */
export function mapSongsToPhotos(
  photos: Album,
  playlist: SpotifyPlaylist
): PhotoWithSong[] {
  // For each track, find the nearest photo without a song,
  // and assign the track to the photo
  let newPhotos: PhotoWithSong[] = [...photos.mediaItems];
  for (const track of playlist.tracks.items) {
    const nearestPhoto = getNearestPhoto(
      new Date(track.added_at).getTime(),
      newPhotos,
      (p) => !p.song
    );
    nearestPhoto.song = track;
    nearestPhoto.isFirst = true;
    if (!nearestPhoto) continue;
  }

  // Then, for each photo which doesn't have a song, find the nearest photo
  // which has one, and assign that song to it
  newPhotos = newPhotos.map((photo) => {
    if (photo.song) return photo;
    const nearestPhotoWithSong = getNearestPhoto(
      new Date(photo.mediaMetadata.creationTime).getTime(),
      newPhotos,
      (p) => !!p.song
    );
    return {
      ...photo,
      song: nearestPhotoWithSong.song,
    };
  });

  const PLAY_SONG_FOR_S = 30;
  // Now, for each song find out how often it occurs,
  // and calculate how long each image must be
  // displayed to play at least 30s of each song
  const songWithPhotoDurationMap = playlist.tracks.items.reduce(
    (obj, track) => {
      const trackOccurences = newPhotos.filter(
        (photo) => photo.song?.track.uri === track.track.uri
      ).length;
      const playDurationPerPhoto = PLAY_SONG_FOR_S / trackOccurences;
      return {
        ...obj,
        [track.track.uri]: playDurationPerPhoto,
      };
    },
    {} as { [key: string]: number }
  );

  const MIN_SLIDE_DURATION = 5;
  newPhotos = newPhotos.map((photo) => {
    const slideDuration = songWithPhotoDurationMap[photo.song?.track.uri];
    return {
      ...photo,
      slideDuration: Math.max(MIN_SLIDE_DURATION, slideDuration),
    };
  });

  return newPhotos;
}
