import { AuthOptions } from "next-auth";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
} satisfies AuthOptions;
