import { observer } from "mobx-react-lite";
import React from "react";

import { FiX as CloseIcon } from "react-icons/fi";
import { FiChevronRight as RightIcon } from "react-icons/fi";
import { FiChevronLeft as LeftIcon } from "react-icons/fi";

import rootStore from "../../../state/RootStore";
import { mediaItemBaseUrlToImgSrc } from "../../../util/google";
import IconButton from "../../IconButton";

interface Props {}

const FullscreenImage = ({}: Props) => {
  const activeImg = rootStore.imagesGrid.find(
    (img) => img.id === rootStore.slideShow?.activePhotoId
  );
  if (!activeImg) return <></>;

  console.log("slideDuration", activeImg.slideDuration);

  return (
    <div
      className="fixed w-full h-full bg-contain bg-center bg-no-repeat bg-black flex flex-col justify-between p-4 z-40"
      style={{
        backgroundImage: `url(${mediaItemBaseUrlToImgSrc(activeImg.baseUrl)})`,
      }}
    >
      <div>
        <IconButton
          onClick={() => {
            rootStore.stopSlidshow();
            rootStore.slideShow.closeSlideShow();
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="flex justify-between">
        <IconButton
          onClick={() => {
            rootStore.stopSlidshow();
            rootStore.previousPhoto();
          }}
          className="opacity-50 hover:opacity-100"
        >
          <LeftIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            rootStore.stopSlidshow();
            rootStore.nextPhoto();
          }}
          className="opacity-50 hover:opacity-100"
        >
          <RightIcon />
        </IconButton>
      </div>
      <div />
    </div>
  );
};

export default observer(FullscreenImage);
