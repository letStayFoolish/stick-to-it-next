"use client";

import React, { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import FormError from "@/components/Form/FormError";
import { Button } from "@/components/ui/button";

type UserInfo = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
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

            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter Email And Password
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                placeholder="johndoe@email.com"
                type="email"
                name="email"
                value={registrationData.user.email ?? ""}
                onChange={handleInputChange}
                // disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                {/*TODO: In a future consider adding forgot password logic*/}
                {/*<Link*/}
                {/*  href="/forgot-password"*/}
                {/*  className="ml-auto inline-block text-sm underline"*/}
                {/*>*/}
                {/*  Forgot your password?*/}
                {/*</Link>*/}
              </div>

              <Input
                placeholder="**********"
                type="password"
                name="password"
                value={registrationData.user.password ?? ""}
                onChange={handleInputChange}
                // disabled={isPending}
              />
            </div>
            {registrationData.error ? (
              <FormError message={registrationData.error} />
            ) : null}

            {/*{<FormSuccess message={success} /> : null}*/}

            <Button className="w-full">Log in</Button>

            <div className="flex items-center justify-center py-3 text-gray-500">
              <span className="border-b-2 border-border w-1/4"></span>
              <span className="text-center font-extralight uppercase text-sm px-4 m-0">
                Or Continue With
              </span>
              <span className="border-b-2 border-border w-1/4"></span>
            </div>
            {/*{isPending ? (*/}
            {/*  <Button variant="outline" className="w-full">*/}
            {/*    {t("SigningIn")}*/}
            {/*  </Button>*/}
            {/*) : (*/}
            {/*  <Button variant="outline" type={"button"} className="w-full">*/}
            {/*    <span className="mr-2">*/}
            {/*      <FaGoogle />*/}
            {/*    </span>{" "}*/}
            {/*    {t("Google")}*/}
            {/*  </Button>*/}
            {/*)}*/}
          </div>
          <div className="mt-4 text-center text-sm">
            Do Not Have Account?{" "}
            <Link
              href={"/register"}
              className="underline hover:opacity-65 hover:text-primary transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </fieldset>
      <div className="hidden lg:flex justify-end flex-col px-3 py-6 border-l-2 border-border text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-600">
        <h2 className="mb-4">{`Welcome back!`}</h2>
        <p>{`We're glad to see you again.`}</p>
        <p>{`Enter your credentials and let's move things forward, together.`}</p>
        <blockquote className="italic border-l-4 border-primary pl-4 mt-6 text-base md:text-lg">
          <p>{`"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful." - Albert Schweitzer`}</p>
        </blockquote>
      </div>
    </form>
  );
};

export default LoginForm;
