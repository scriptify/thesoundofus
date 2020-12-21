import { observer } from "mobx-react-lite";
import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import rootStore from "../../state/RootStore";
import Dialog from "../Dialog";
import CurrentlyPlayingSong from "./CurrentlyPlayingSong";
import FullscreenImage from "./FullscreenImage";
import PhotoTile from "./PhotoTile";
import SlideshowButton from "./SlideshowButton";

interface Props {}

const ImagesGrid = ({}: Props) => {
  const isLoading =
    rootStore.imagesGrid.length === 0 ||
    !rootStore.slideShow ||
    rootStore.slideShow.loading;

  if (isLoading) {
    return (
      <Dialog>
        <div className="h-20">
          <img
            src="/loading.svg"
            className="h-full w-auto"
            style={{ filter: "invert(1)" }}
          />
        </div>
      </Dialog>
    );
  }

  return (
    <>
      <FullscreenImage />
      <CurrentlyPlayingSong />
      <SlideshowButton />
      <section>
        <header className="py-24 sm:flex justify-center items-center">
          <img
            src={rootStore.playlist?.images[2].url}
            className="mx-auto sm:mr-2 sm:ml-0 mb-6 sm:mb-0"
          />
          <h1 className="text-7xl text-center text-black font-bold tracking-wider">
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
                onClick={() => rootStore.startSlideShow(image.id)}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </section>
    </>
  );
};

export default observer(ImagesGrid);
