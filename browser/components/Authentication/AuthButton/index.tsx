import React, { ReactNode } from "react";
import classnames from "classnames";
import { FiArrowRight as GoIcon } from "react-icons/fi";
import { FiCheck as CheckIcon } from "react-icons/fi";

interface Props {
  isAuthenticated: boolean;
  url: string;
  icon: ReactNode;
  text?: ReactNode;
}

const AuthButton = ({ icon, isAuthenticated, url, text }: Props) => {
  return (
    <a
      className={classnames(
        "p-4 rounded-lg shadow-md flex justify-between w-full bg-white items-center",
        { ["shadow-none opacity-50"]: isAuthenticated }
      )}
      href={url}
    >
      <div className="h-4 w-auto">{icon}</div>
      <div className="uppercase text-gray-400">{text}</div>
      <button className="h-4 w-auto">
        {isAuthenticated ? <CheckIcon color="#1DB954" /> : <GoIcon />}
      </button>
    </a>
  );
};

export default AuthButton;
