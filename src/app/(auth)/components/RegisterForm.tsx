"use client";

import React, { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import FormError from "@/components/Form/FormError";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import { Label } from "@/components/ui/label";

/**
 * Sign-up functionality
 * You can use the <form> element with React's Server Actions and `useActionState` to capture user credentials, validate form fields, and call your Authentication Provider's API or database.
 *
 * Since Server Actions always execute on the server, they provide a secure environment for handling authentication logic.
 * @constructor
 */
const RegisterForm: React.FC = () => {
  const t = useTranslations("Auth");
  const tBrand = useTranslations("Brand");
  const [state, formAction, isPending] = useActionState(
    signupAction,
    undefined,
  );

  const { isPasswordValid, checkPassword } = usePasswordValidation();

  useEffect(() => {
    if (state?.success) {
      redirect("/");
    }
    return;
  }, [state]);

  return (
    <form
      className="w-full h-full flex items-center justify-center lg:grid lg:grid-cols-2"
      action={formAction}
    >
      <fieldset
        className="flex items-center justify-center py-12 space-y-6"
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
                {tBrand("name")}
              </span>
              <span className="sr-only">{tBrand("name")}</span>
            </Link>

            <h1 className="text-3xl font-bold">{t("register")}</h1>
            <p className="text-balance text-muted-foreground">
              {t("registerSubheading")}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex flex-col mb-4 gap-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder={t("namePlaceholder")}
                  name="name"
                />
              </div>
              {state?.errors?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.name ?? ""}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col mb-4 gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  name="email"
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.email ?? ""}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  name="password"
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
                  <p>{t("passwordMustIntro")}</p>
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
            <Button
              className="w-full mt-16 py-2 text-lg"
              disabled={isPending || !!isPasswordValid.message}
            >
              {isPending ? t("submitting") : t("register")}
            </Button>
            {/*Todo: In near future I plan to add register/login using Google OAuth*/}
            {/*<div className="flex items-center justify-center py-3 text-gray-500">*/}
            {/*  <span className="border-b-2 border-border w-1/4"></span>*/}
            {/*  <span className="text-center font-extralight uppercase text-sm px-4 m-0">*/}
            {/*    Or Continue With*/}
            {/*  </span>*/}
            {/*  <span className="border-b-2 border-border w-1/4"></span>*/}
            {/*</div>*/}
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
            {/* ============================================================ */}
          </div>
          <div className="mt-4 text-center text-sm">
            {t("haveAccount")}{" "}
            <Link
              href={"/login"}
              className="underline hover:opacity-65 hover:text-primary transition duration-300"
            >
              {t("signIn")}
            </Link>
          </div>
        </div>
      </fieldset>
      <div className="hidden h-full lg:flex flex-col justify-end items-start px-3 py-6 border-l-2 border-border text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-gray-600">
        <div>
          <h2 className="mb-4">{t("registerWelcome")}</h2>
          <p>{t("registerWelcomeBody")}</p>
          <p>{t("registerWelcomePrompt")}</p>
        </div>
        <blockquote className="italic border-l-4 border-primary pl-4 mt-6 text-base md:text-lg">
          <p>{t("quote")}</p>
        </blockquote>
      </div>
    </form>
  );
};

export default RegisterForm;
