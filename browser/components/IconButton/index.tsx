import React from "react";
import classnames from "classnames";

interface Props extends React.ComponentProps<"button"> {
  size?: "small" | "middle" | "large";
}

const IconButton: React.FC<Props> = ({
  className,
  size = "small",
  ...rest
}) => {
  return (
    <button
      className={classnames(
        className,
        "bg-white rounded-full flex justify-center items-center shadow-md hover:shadow-lg",
        { ["p-2"]: size === "small" },
        { ["p-4"]: size === "middle" },
        { ["p-6"]: size === "large" }
      )}
      {...rest}
    />
  );
};

export default IconButton;
