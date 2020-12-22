import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { FiPlay as PlayIcon, FiPause as PauseIcon } from "react-icons/fi";
import rootStore from "../../../state/RootStore";
import { animateValue } from "../../../util/animation";
import CircleProgress from "../../CircleProgress";
import IconButton from "../../IconButton";

interface Props {}

const SlideshowButton = ({}: Props) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let didCancel = false;
    if (rootStore.slideShow.activePhotoId) {
      const photo = rootStore.imagesGrid.find(
        (p) => p.id === rootStore.slideShow.activePhotoId
      );
      animateValue({
        from: 0,
        to: 1,
        duration: photo.slideDuration * 1000,
        onAnimate: (currProgress) => {
          if (!didCancel) {
            setProgress(currProgress);
          }
        },
      });
    }

    return () => {
      didCancel = true;
    };
  }, [rootStore.slideShow.activePhotoId]);

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
      <div
        style={{
          height: "40px",
          width: "40px",
          marginTop: "-50px",
          marginLeft: "4px",
        }}
      >
        <CircleProgress progress={progress} />
      </div>
    </div>
  );
};

export default observer(SlideshowButton);
