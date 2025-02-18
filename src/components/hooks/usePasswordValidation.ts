"use client";

import { FormEvent, useState } from "react";

export function usePasswordValidation() {
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

  return { isPasswordValid, checkPassword };
}
