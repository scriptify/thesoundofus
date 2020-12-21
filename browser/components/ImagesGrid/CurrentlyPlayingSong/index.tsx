import { observer } from "mobx-react-lite";
import React from "react";
import rootStore from "../../../state/RootStore";
import { SongPreview } from "../../SongPreview";

interface Props {}

const CurrentlyPlayingSong = ({}: Props) => {
  const activeSong = rootStore.playlist?.tracks.items.find(
    (track) => track.track.uri === rootStore.slideShow?.activeSongUri
  );

  if (!activeSong) return <></>;

  const cover =
    activeSong.track.album.images[1]?.url ??
    activeSong.track.album.images[0]?.url;

  return (
    <div className="fixed bottom-0 left-0 p-4 z-50">
      <SongPreview
        coverUrl={cover}
        name={activeSong.track.name}
        artists={activeSong.track.artists
          .map((artist) => artist.name)
          .join(", ")}
      />
    </div>
  );
};

export default observer(CurrentlyPlayingSong);
