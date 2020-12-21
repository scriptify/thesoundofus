import React from "react";

interface Props {}

const Dialog: React.FC<Props> = ({ children }) => {
  return (
    <section
      className="w-full h-full fixed flex justify-center items-center p-4 bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url(/bg.jpg)",
      }}
    >
      {children}
    </section>
  );
};

export default Dialog;
