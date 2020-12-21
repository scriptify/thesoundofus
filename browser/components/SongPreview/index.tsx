import React from "react";
import classnames from "classnames";

interface Props {
  name: string;
  coverUrl: string;
  artists: string;
  size?: "small" | "normal";
}

export const SongPreview = ({
  name,
  coverUrl,
  artists,
  size = "normal",
}: Props) => {
  return (
    <div
      className={classnames(
        "rounded-full flex justify-between items-center bg-black pr-4 shadow-lg",
        {
          "h-14": size === "normal",
          "h-10": size === "small",
        }
      )}
      style={{ width: "fit-content" }}
    >
      <img src={coverUrl} className="h-full w-auto rounded-full p-2" />
      <div className="ml-2 text-left">
        <h3
          className={classnames("text-gray-200", {
            "text-base": size === "normal",
            "text-sm": size === "small",
          })}
        >
          {name}
        </h3>
        <h4
          className={classnames("text-gray-200", {
            "text-sm": size === "normal",
            "text-xs": size === "small",
          })}
        >
          {artists}
        </h4>
      </div>
    </div>
  );
};
