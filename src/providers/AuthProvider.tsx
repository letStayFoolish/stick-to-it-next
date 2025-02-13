"use client";

import React, { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

type Props = PropsWithChildren;

const AuthProvider: React.FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
