import { observer } from "mobx-react-lite";
import React from "react";
import { FiPlay as PlayIcon, FiPause as PauseIcon } from "react-icons/fi";
import rootStore from "../../../state/RootStore";
import IconButton from "../../IconButton";

interface Props {}

const SlideshowButton = (props: Props) => {
  return (
    <div className="fixed z-50 right-0 bottom-0 p-4">
      <IconButton
        size="middle"
        onClick={() => {
          if (rootStore.isSlideshowActive) {
            rootStore.stopSlidshow();
          } else {
            rootStore.startSlideShow();
          }
        }}
      >
        {rootStore.isSlideshowActive ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
    </div>
  );
};

export default observer(SlideshowButton);
