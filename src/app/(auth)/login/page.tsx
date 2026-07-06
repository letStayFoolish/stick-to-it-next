import { Metadata } from "next";
import LoginForm from "@/app/(auth)/components/LoginForm";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage: React.FC = () => {
  return (
    <main>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
};

export default LoginPage;
