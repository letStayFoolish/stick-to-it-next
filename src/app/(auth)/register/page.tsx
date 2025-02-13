import React from "react";
import RegisterForm from "@/app/(auth)/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration",
};

const RegisterPage = () => {
  return (
    <main>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
