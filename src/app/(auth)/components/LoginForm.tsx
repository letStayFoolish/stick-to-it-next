"use client";

import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormError from "@/components/Form/FormError";
import { redirect } from "next/navigation";
import { signinAction } from "@/lib/actions";

const LoginForm: React.FC = () => {
  // const [formState, setFormState] = useState({
  //   errors: {} as Record<string, string[] | undefined>,
  //   isPending: false,
  //   success: false,
  //   error: "",
  // });

  const [state, formAction, isPending] = useActionState(
    signinAction,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      redirect("/profile");
    }
    return;
  }, [state]);

  // const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //
  //   setFormState((prev) => ({
  //     ...prev,
  //     isPending: true,
  //     errors: {},
  //     error: "",
  //   }));
  //
  //   // Extract form data
  //   const formData = new FormData(e.currentTarget);
  //   const email = formData.get("email") as string;
  //   const password = formData.get("password") as string;
  //
  //   // Client-side validation (optional, in addition to Zod validation)
  //   if (!email || !password) {
  //     setFormState((prev) => ({
  //       ...prev,
  //       isPending: false,
  //       errors: {
  //         email: !email ? ["Email is required"] : undefined,
  //         password: !password ? ["Password is required"] : undefined,
  //       },
  //     }));
  //     return;
  //   }
  //
  //   // Attempt to log in using NextAuth's signIn
  //   // const response = await signIn("credentials", {
  //   //   redirect: false,
  //   //   email,
  //   //   password,
  //   // });
  //
  //   const existingUser = await User.findOne({ email });
  //
  //   console.log({ existingUser });
  //
  //   const response = await createSession(existingUser._id.toString());
  //
  //   if (response) {
  //     // if (response && !response.error) {
  //     setFormState((prev) => ({ ...prev, isPending: false, success: true }));
  //
  //     // window.location.href = "/profile"; // Redirect to /profile on success
  //     router.push("/profile");
  //   } else {
  //     setFormState((prev) => ({
  //       ...prev,
  //       isPending: false,
  //       error: response?.error || "Login failed. Please try again.",
  //     }));
  //   }
  // };

  // const { errors, isPending, error } = formState;

  return (
    <form
      className="w-full h-screen flex justify-center flex-1 lg:grid lg:grid-cols-2"
      action={formAction}
      // onSubmit={handleSubmit}
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
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="johndoe@email.com"
              />
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

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="**********"
              />
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

            <Button className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Log in"}
            </Button>
            <div className="flex items-center justify-center py-3 text-gray-500">
              <span className="border-b-2 border-border w-1/4"></span>
              <span className="text-center font-extralight uppercase text-sm px-4 m-0">
                Or Continue With
              </span>
              <span className="border-b-2 border-border w-1/4"></span>
            </div>
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
