import React from "react";
import { PhotoWithSong } from "../../../state/types";
import { SongPreview } from "../../SongPreview";

interface Props {
  photo: PhotoWithSong;
  onClick: () => void;
}

const PhotoTile = ({ photo, onClick }: Props) => {
  const cover =
    photo.song.track.album.images[1]?.url ??
    photo.song.track.album.images[0]?.url;

  return (
    <button onClick={onClick} className="w-full h-full" key={photo.id}>
      <img src={photo.baseUrl} className="w-full" />
      {photo.isFirst && (
        <SongPreview
          size="small"
          coverUrl={cover}
          name={photo.song.track.name}
          artists={photo.song.track.artists
            .map((artist) => artist.name)
            .join(", ")}
        />
      )}
    </button>
  );
};

export default PhotoTile;
