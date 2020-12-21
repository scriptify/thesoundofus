import { observer } from "mobx-react-lite";
import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import rootStore from "../../state/RootStore";

interface Props {}

const ImagesGrid = ({}: Props) => {
  return (
    <section>
      <header className="py-12">
        <h1 className="text-6xl text-center">The Sound of Us</h1>
      </header>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 3, 1100: 4 }}>
        <Masonry gutter="4px">
          {rootStore.imagesGrid.map((image) => (
            <img src={image.baseUrl} className="w-full" key={image.id} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </section>
  );
};

export default observer(ImagesGrid);
