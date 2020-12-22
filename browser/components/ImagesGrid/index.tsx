import { observer } from "mobx-react-lite";
import React from "react";
import ms from "ms";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import rootStore from "../../state/RootStore";
import { FiPlay as PlayIcon } from "react-icons/fi";

import IconButton from "../IconButton";
import Loading from "../Loading";
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
    return <Loading />;
  }

  const fromDate = new Date(
    rootStore.imagesGrid[0]?.mediaMetadata.creationTime
  );
  const toDate = new Date(
    rootStore.imagesGrid[
      rootStore.imagesGrid.length - 1
    ]?.mediaMetadata.creationTime
  );

  return (
    <>
      <FullscreenImage />
      <CurrentlyPlayingSong />
      <SlideshowButton />
      <section>
        <header className="py-24">
          <div className="sm:flex justify-center items-center">
            <img
              src={rootStore.playlist?.images[2].url}
              className="mx-auto sm:mr-2 sm:ml-0 mb-6 sm:mb-0"
            />
            <h1 className="text-7xl text-center text-black font-bold tracking-wider">
              The Sound of Us
            </h1>
          </div>
          <h2 className="text-lg text-gray-600 text-center italic">
            {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
          </h2>
          <h2 className="text-base text-gray-400 text-center italic">
            {ms(rootStore.slideshowDuration * 1000)}
          </h2>
          <IconButton
            size="large"
            onClick={() => {
              rootStore.startSlideShow();
            }}
            className="mx-auto mt-2"
          >
            <PlayIcon />
          </IconButton>
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
