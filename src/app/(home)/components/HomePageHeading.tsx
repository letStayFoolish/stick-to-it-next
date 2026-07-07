import React from "react";
import { getTranslations } from "next-intl/server";
import { getUser } from "@/lib/dal";
import Link from "next/link";

const HomePageHeading: React.FC = async () => {
  const [user, t] = await Promise.all([getUser(), getTranslations("Home")]);

  return (
    <div className="mb-6 text-center">
      <>
        {user ? (
          <h1 className="font-bold text-3xl md:text-4xl mb-2 drop-shadow-md">
            {t.rich("greeting", {
              name: () => (
                <span className="text-accent-ink">
                  {user.name?.split(" ")[0]}
                </span>
              ),
            })}
          </h1>
        ) : (
          <h1 className="font-bold text-3xl md:text-4xl mb-2">
            {t("welcome")}
          </h1>
        )}

        <p className="mx-auto text-xl text-gray-600 w-2/3">
          {user ? (
            t("loggedInBody")
          ) : (
            <>
              <span className="text-accent-ink font-medium underline hover:opacity-75 transition-all">
                <Link href={"/register"}>{t("loggedOutCreateAccount")}</Link>
              </span>
              {t("loggedOutOr")}
              <span className="text-accent-ink font-medium underline hover:opacity-75 transition-all">
                <Link href={"/login"}>{t("loggedOutUseOne")}</Link>
              </span>
              {t("loggedOutBody")}
            </>
          )}
        </p>
      </>
    </div>
  );
};

export default HomePageHeading;
