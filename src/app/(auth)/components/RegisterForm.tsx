"use client";

import React, { FormEvent, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import FormError from "@/components/Form/FormError";

/**
 * Sign-up functionality
 * You can use the <form> element with React's Server Actions and `useActionState` to capture user credentials, validate form fields, and call your Authentication Provider's API or database.
 *
 * Since Server Actions always execute on the server, they provide a secure environment for handling authentication logic.
 * @constructor
 */
const RegisterForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    undefined,
  );

  const [isPasswordValid, setIsPasswordValid] = useState<{
    status: boolean;
    message: string;
  }>({ status: true, message: "" });

  function checkPassword(event: FormEvent<HTMLInputElement>) {
    const typedPassword = (event.target as HTMLInputElement).value;

    if (typedPassword.length < 8) {
      setIsPasswordValid({
        status: false,
        message: "Password must be at least 8 characters",
      });
      return;
    }

    if (!/[a-zA-Z]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: "Password must contain at least one letter.",
      });
      return;
    }

    if (!/[0-9]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: "Password must contain at least one number.",
      });

      return;
    }
    if (!/[@$!%*?&#]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: "Password must contain at least one special character",
      });
      return;
    }

    setIsPasswordValid({ status: true, message: "" });
  }

  useEffect(() => {
    if (state?.success) {
      redirect("/");
    }
    return;
  }, [state]);

  return (
    <form
      className="w-full h-screen flex justify-center flex-1 lg:grid lg:grid-cols-2 overflow-hidden"
      action={formAction}
    >
      <fieldset
        className="flex items-center justify-center py-6 space-y-4 lg:overflow-auto"
        disabled={isPending}
      >
        <div className="mx-auto grid w-[350px] gap-4">
          <div className="grid gap-1 text-center mb-2">
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
              <Input id="name" type="name" placeholder="John Doe" name="name" />
              {state?.errors?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.name ?? ""}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                name="email"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.email ?? ""}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Input
                id="password"
                type="password"
                placeholder="**********"
                name="password"
                onInput={checkPassword}
              />
              {!isPasswordValid.status && (
                <p className="mt-1 text-sm text-red-500">
                  {isPasswordValid.message}
                </p>
              )}

              {state?.errors?.password && (
                <div>
                  <p>Password must:</p>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li className="mt-1 text-sm text-red-500" key={error}>
                        - {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {state && state.error && <FormError message={state.error} />}
            <Button className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Register"}
            </Button>
            <div className="flex items-center justify-center py-3 text-gray-500">
              <span className="border-b-2 border-border w-1/4"></span>
              <span className="text-center font-extralight uppercase text-sm px-4 m-0">
                Or Continue With
              </span>
              <span className="border-b-2 border-border w-1/4"></span>
            </div>
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
            Already Have Account?{" "}
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
