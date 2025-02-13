"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type UserInfo = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const [registrationData, setRegistrationData] = useState<{
    user: UserInfo;
    error: string | null;
  }>({
    user: {
      email: "",
      password: "",
    },
    error: null,
  });

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dataValue = e.target.value;

    setRegistrationData((prevData) => ({
      ...prevData,
      user: {
        ...prevData.user,
        [e.target.name]: dataValue,
      },
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: registrationData.user.email,
        password: registrationData.user.password,
      });

      if (response?.error) {
        setRegistrationData((prevData) => ({
          ...prevData,
          error: response.error as string,
        }));

        return;
      }

      router.push("/profile");
    } catch (error: any) {
      setRegistrationData((prevState) => ({
        ...prevState,
        error: error.message,
      }));
      console.log("Error during registration: ", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Enter your credentials to log in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={registrationData.user["email"] ?? ""}
            onChange={handleInputChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={registrationData.user["password"] ?? ""}
            onChange={handleInputChange}
          />
          <button className="bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition">
            Login
          </button>

          <div className="text-red-500 text-sm text-center">
            {/* Replace this text with error-handling logic */}
            {registrationData.error && registrationData.error}
          </div>
          <Link
            href="/register"
            className="text-blue-500 hover:underline text-center text-sm"
          >
            Register
          </Link>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
