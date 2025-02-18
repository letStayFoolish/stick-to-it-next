import React from "react";
import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Profile Page",
};

const Profile: React.FC = async () => {
  const session = await verifySession();

  if (!session) return null;

  return (
    <main>
      <h1>Profile Page</h1>
    </main>
  );
};

export default Profile;
