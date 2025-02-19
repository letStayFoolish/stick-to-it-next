"use client";

import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormError from "@/components/Form/FormError";
import { redirect } from "next/navigation";
import { signinAction } from "@/lib/actions";
import { usePasswordValidation } from "@/components/hooks/usePasswordValidation";
import { Label } from "@/components/ui/label";

const LoginForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    signinAction,
    undefined,
  );

  const { isPasswordValid, checkPassword } = usePasswordValidation();

  useEffect(() => {
    if (state?.success) {
      redirect("/profile");
    }
    return;
  }, [state]);

  return (
    <form
      className="w-full h-full mt-auto flex items-center justify-center lg:grid lg:grid-cols-2"
      action={formAction}
    >
      <fieldset
        className="flex items-center justify-center py-12 space-y-6"
        disabled={isPending}
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
              <div className="flex flex-col mb-4 gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {state?.errors.email ?? ""}
                </p>
              )}
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  onInput={checkPassword}
                />
              </div>

              {!isPasswordValid.status && isPasswordValid.message && (
                <p className="mt-1 text-sm text-red-500">
                  {isPasswordValid.message}
                </p>
              )}
              {state?.errors?.password && (
                <div>
                  <p>Password must:</p>
                  <ul>
                    {state?.errors.password.map((error) => (
                      <li className="mt-1 text-sm text-red-500" key={error}>
                        - {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {state?.error && <FormError message={state.error} />}

            <Button
              className="w-full"
              disabled={isPending || !!isPasswordValid.message}
            >
              {isPending ? "Logging in..." : "Log in"}
            </Button>
            {/*<div className="flex items-center justify-center py-3 text-gray-500">*/}
            {/*  <span className="border-b-2 border-border w-1/4"></span>*/}
            {/*  <span className="text-center font-extralight uppercase text-sm px-4 m-0">*/}
            {/*    Or Continue With*/}
            {/*  </span>*/}
            {/*  <span className="border-b-2 border-border w-1/4"></span>*/}
            {/*</div>*/}
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
      <div className="hidden h-full lg:flex flex-col justify-end items-start px-3 py-6 border-l-2 border-border text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-600">
        <div>
          <h2 className="mb-4">{`Welcome back!`}</h2>
          <p>{`We're glad to see you again.`}</p>
          <p>{`Enter your credentials and let's move things forward, together.`}</p>
        </div>
        <blockquote className="italic border-l-4 border-primary pl-4 mt-6 text-base md:text-lg">
          <p>{`"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful." - Albert Schweitzer`}</p>
        </blockquote>
      </div>
    </form>
  );
};

export default LoginForm;
