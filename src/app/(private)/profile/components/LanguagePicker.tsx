"use client";

import React, { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateLanguage as updateLanguageAction } from "@/lib/actions/updateLanguage";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/locale";
import { Label } from "@/components/ui/label";
import FormError from "@/components/Form/FormError";

const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  sr: "Srpski",
  es: "Español",
  de: "Deutsch",
};

type Props = {
  currentLocale: Locale;
};

const LanguagePicker: React.FC<Props> = ({ currentLocale }) => {
  const t = useTranslations("Profile");
  const [state, formAction, isPending] = useActionState(updateLanguageAction, {
    success: false,
  });

  return (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <Label htmlFor="language">{t("languageLabel")}</Label>
      <select
        key={currentLocale}
        id="language"
        name="language"
        defaultValue={currentLocale}
        disabled={isPending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {NATIVE_NAMES[locale]}
          </option>
        ))}
      </select>
      <FormError message={state.message} />
    </form>
  );
};

export default LanguagePicker;
