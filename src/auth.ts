import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "@auth/core/providers/credentials";
import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

/**
 * `params` object of `authorization` which will force the Refresh Token to always be provided on sign in,
 * however this will ask all users to confirm if they wish to grant your application access every time they sign in.
 *
 * If you need access to the RefreshToken or AccessToken for a Google account,
 * and you are not using a database to persist user accounts, this may be something you need to do.
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          await connectDB();

          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const isPasswordsMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (!isPasswordsMatch) {
            return null;
          }

          return user;
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});
