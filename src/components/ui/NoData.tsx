import React from "react";

type Props = { text: string };

const NoData: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center w-full md:w-1/2">
        <span className="text-5xl mb-4" role="img" aria-label="No Data Emoji">
          🤷‍♂️
        </span>
        <p className="text-accent-foreground text-xl mt-6">{text}</p>
      </div>
    </div>
  );
};

export default NoData;
