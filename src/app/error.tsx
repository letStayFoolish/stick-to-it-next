"use client";
import React from "react";
import GoToPage from "@/components/GoToPage";
import { NextPage } from "next";

type ErrorProps = {
  statusCode?: number;
};

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted text-center text-primary">
      <h1 className="text-6xl font-bold mb-4">{statusCode || "Error"}</h1>
      <p className="text-lg mb-6">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
      <GoToPage
        href="/"
        className="mt-6 mb-12 bg-primary text-primary-foreground rounded-md text-xl px-6 py-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out"
      >
        Back to Home
      </GoToPage>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
