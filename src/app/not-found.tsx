import React from "react";
import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted text-center text-primary">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 mt-4 bg-primary text-white rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
