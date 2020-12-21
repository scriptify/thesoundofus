import React from "react";
import Dialog from "../Dialog";

interface Props {}

const Loading = (props: Props) => {
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
};

export default Loading;
