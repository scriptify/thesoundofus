import { observer } from "mobx-react-lite";
import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import rootStore from "../../state/RootStore";
import CurrentlyPlayingSong from "./CurrentlyPlayingSong";
import FullscreenImage from "./FullscreenImage";
import PhotoTile from "./PhotoTile";

interface Props {}

const ImagesGrid = ({}: Props) => {
  const isLoading =
    rootStore.imagesGrid.length === 0 ||
    !rootStore.slideShow ||
    rootStore.slideShow.loading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FullscreenImage />
      <CurrentlyPlayingSong />
      <section>
        <header className="py-12">
          <h1 className="text-6xl text-center text-white font-bold">
            The Sound of Us
          </h1>
        </header>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 3, 1100: 4 }}
        >
          <Masonry gutter="0px">
            {rootStore.imagesGrid.map((image) => (
              <PhotoTile
                key={image.id}
                photo={image}
                onClick={() =>
                  rootStore.slideShow.setActivePhoto({
                    activePhotoId: image.id,
                    activeSongUri: image.song.track.uri,
                  })
                }
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </section>
    </>
  );
};

export default observer(ImagesGrid);
