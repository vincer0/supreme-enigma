import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "@/lib/api/axios";

const RESPONSE_STATUS_OK = 200;

declare module "next-auth" {
  interface User {
    createdAt: Date;
  }
  interface Session {
    user: {
      createdAt: Date;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (_, request) => {
        // next-auth mirrors laravel auth state so we are getting user here only
        try {
          const userUrl = `${process.env.NEXT_SERVER_API_URL}/user`;

          const cookie = request.headers.get("cookie") ?? "";

          if (!cookie) return null;

          const response = await axios.get(userUrl, {
            headers: { cookie },
            validateStatus: () => true, // prevent throw
          });

          console.log("Authorize response:", response);

          if (response.status === RESPONSE_STATUS_OK && response.data) {
            return response.data;
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
