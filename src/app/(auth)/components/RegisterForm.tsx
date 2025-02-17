"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import FormError from "@/components/Form/FormError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserInfo = {
  name: string;
  email: string;
  password: string;
  likedItems?: string[];
  listItems?: string[];
};

const RegisterForm: React.FC = () => {
  const [registrationData, setRegistrationData] = useState<{
    user: UserInfo;
    error: string | null;
  }>({
    user: {
      name: "",
      email: "",
      password: "",
      likedItems: [],
      listItems: [],
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
    <form
      className="w-full h-screen flex justify-center flex-1 lg:grid lg:grid-cols-2"
      noValidate
      onSubmit={handleSubmit}
    >
      <fieldset
        className="flex items-center justify-center py-12 space-y-6"
        disabled={false}
      >
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center mb-4">
            <Link
              href="/"
              className="bg-muted rounded-md px-4 py-2 flex items-center justify-center gap-1 text-lg font-semibold md:text-base mb-6"
            >
              <ShoppingCart />
              <span className="block lg:text-xl font-bold ml-2">
                Stick To It
              </span>
              <span className="sr-only">Stick To It</span>
            </Link>

            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              {`Enter your full name, email and password below to create your account`}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                placeholder="John Doe"
                type="name"
                name="name"
                value={registrationData.user.name ?? ""}
                onChange={handleInputChange}
                // disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                placeholder="m@example.com"
                type="email"
                name="email"
                value={registrationData.user.email ?? ""}
                onChange={handleInputChange}
                // disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                placeholder="**********"
                type="password"
                name="password"
                value={registrationData.user.password ?? ""}
                onChange={handleInputChange}
                // disabled={isLoading}
              />
            </div>
            {registrationData.error ? (
              <FormError message={registrationData.error} />
            ) : null}

            <Button className="w-full">Register</Button>
            <div className="flex items-center justify-center py-3 text-gray-500">
              <span className="border-b-2 border-border w-1/4"></span>
              <span className="text-center font-extralight uppercase text-sm px-4 m-0">
                Or Continue With
              </span>
              <span className="border-b-2 border-border w-1/4"></span>
            </div>
            {/*{isLoading ? (*/}
            {/*  <Button variant="outline" className="w-full">*/}
            {/*    {tr("SigningIn")}*/}
            {/*  </Button>*/}
            {/*) : (*/}
            {/*  <Button variant="outline" type={"button"} className="w-full">*/}
            {/*    <span className="mr-2">*/}
            {/*      <FaGoogle />*/}
            {/*    </span>{" "}*/}
            {/*    {tr("Google")}*/}
            {/*  </Button>*/}
            {/*)}*/}
          </div>
          <div className="mt-4 text-center text-sm">
            Already Have Account{" "}
            <Link
              href={"/login"}
              className="underline hover:opacity-65 hover:text-primary transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </fieldset>
      <div className="hidden lg:flex justify-end flex-col px-3 py-6 border-l-2 border-border text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-600">
        <h2 className="mb-4">{`Welcome!`}</h2>
        <p>{`Welcome aboard, we're excited to have you join our community!`}</p>
        <p>{`Enter your name, email, password and let's move things forward, together.`}</p>
        <blockquote className="italic border-l-4 border-primary pl-4 mt-6 text-base md:text-lg">
          <p>{`"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful." - Albert Schweitzer`}</p>
        </blockquote>
      </div>
    </form>
  );
};

export default RegisterForm;
