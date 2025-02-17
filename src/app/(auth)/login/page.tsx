import { Metadata } from "next";
import LoginForm from "@/app/(auth)/components/LoginForm";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage: React.FC = () => {
  return (
    <main>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
