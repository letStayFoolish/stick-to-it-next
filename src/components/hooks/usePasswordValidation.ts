"use client";

import { FormEvent, useState } from "react";

export function usePasswordValidation() {
  const [isPasswordValid, setIsPasswordValid] = useState<{
    status: boolean;
    message: string | null;
  }>({ status: true, message: null });

  function checkPassword(event: FormEvent<HTMLInputElement>) {
    const typedPassword = (event.target as HTMLInputElement).value;

    if (typedPassword.length !== 0 && typedPassword.length < 8) {
      setIsPasswordValid({
        status: false,
        message: "Password must be at least 8 characters",
      });
      return;
    }

    if (typedPassword.length !== 0 && !/[a-zA-Z]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: "Password must contain at least one letter.",
      });
      return;
    }

    if (typedPassword.length !== 0 && !/[0-9]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: "Password must contain at least one number.",
      });

      return;
    }
    if (typedPassword.length !== 0 && !/[@$!%*?&#]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: "Password must contain at least one special character",
      });
      return;
    }

    setIsPasswordValid({ status: true, message: null });
  }

  return { isPasswordValid, checkPassword };
}
