"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export function usePasswordValidation() {
  const t = useTranslations("Validation");
  const [isPasswordValid, setIsPasswordValid] = useState<{
    status: boolean;
    message: string | null;
  }>({ status: true, message: null });

  function checkPassword(event: FormEvent<HTMLInputElement>) {
    const typedPassword = (event.target as HTMLInputElement).value;

    if (typedPassword.length !== 0 && typedPassword.length < 8) {
      setIsPasswordValid({
        status: false,
        message: t("passwordMin"),
      });
      return;
    }

    if (typedPassword.length !== 0 && !/[a-zA-Z]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: t("passwordLetter"),
      });
      return;
    }

    if (typedPassword.length !== 0 && !/[0-9]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: t("passwordNumber"),
      });

      return;
    }
    if (typedPassword.length !== 0 && !/[@$!%*?&#]/.test(typedPassword)) {
      setIsPasswordValid({
        status: false,
        message: t("passwordSpecial"),
      });
      return;
    }

    setIsPasswordValid({ status: true, message: null });
  }

  return { isPasswordValid, checkPassword };
}
