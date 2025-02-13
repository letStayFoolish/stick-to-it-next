"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type UserInfo = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [registrationData, setRegistrationData] = useState<{
    user: UserInfo;
    error: string | null;
  }>({
    user: {
      name: "",
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

    if (
      !registrationData.user ||
      !registrationData.user.name ||
      !registrationData.user.email ||
      !registrationData.user.password
    ) {
      setRegistrationData((prevState) => ({
        ...prevState,
        error: "Missing required fields",
      }));

      throw new Error("Missing required fields");
    }

    const requestBody = registrationData.user;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const form = e.target;

        setRegistrationData((prevState) => ({
          ...prevState,
          error: null,
        }));

        form.reset();

        router.push("/login");
      } else {
        console.log({ response });
        if (response.status === 409) {
          throw new Error("Email already in use");
        }
        throw new Error("Registration failed");
      }
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
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            className="border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={registrationData.user["name"] ?? ""}
            onChange={handleInputChange}
          />
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
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>

          <div className="text-red-500 text-sm text-center">
            {/* Replace this text with error-handling logic */}
            {registrationData.error && registrationData.error}
          </div>
          <Link
            href="/login"
            className="text-gray-500 hover:underline text-center text-sm"
          >
            Already have an account? Log in
          </Link>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
