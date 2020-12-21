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
    <button
      onClick={onClick}
      className="w-full relative"
      style={{ marginTop: "-7px" }}
      key={photo.id}
    >
      {photo.isFirst && (
        <div className="absolute bottom-0 mb-4 ml-2">
          <SongPreview
            size="small"
            coverUrl={cover}
            name={photo.song.track.name}
            artists={photo.song.track.artists
              .map((artist) => artist.name)
              .join(", ")}
          />
        </div>
      )}
      <img src={photo.baseUrl} className="w-full" />
    </button>
  );
};

export default PhotoTile;
