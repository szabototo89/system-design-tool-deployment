import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { applicationLogger } from "@/logging/logger";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/schema";
import { userQuery } from "@/db/entities/users/queries";
import { getServerSession as getNextServerSession } from "next-auth/next";

export function getServerSession() {
  return getNextServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  if (userEmail == null) {
    return null;
  }

  return userQuery.findUserByEmail(userEmail);
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        applicationLogger.warn(credentials);

        if (credentials == null) {
          return null;
        }

        const user = await userQuery.findUserByEmailAndPassword(
          credentials.username,
          credentials.password,
        );

        applicationLogger.info(user, "User was logged in.");

        return user ?? null;
      },
    }),
  ],
} satisfies AuthOptions;
