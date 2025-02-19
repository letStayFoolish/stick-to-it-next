import React from "react";

type Props = {
  children?: React.ReactNode;
};
const PageHeading: React.FC<Props> = ({ children }) => {
  return (
    <h1 className="font-bold text-3xl md:text-4xl mb-2 drop-shadow-md">
      {children}
    </h1>
  );
};

export default PageHeading;
