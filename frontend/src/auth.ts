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
      authorize: async (credentials) => {
        try {
          await axios.get(
            new URL("sanctum/csrf-cookie", process.env.NEXT_CSRF_URL).toString()
          );

          const response = await axios.post("/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (response.status === RESPONSE_STATUS_OK && response.data?.user) {
            /*  id: 1,
                name: 'Test User',
                email: 'test@example.com',
                email_verified_at: '2025-12-17T09:40:22.000000Z',
                created_at: '2025-12-17T09:40:23.000000Z',
                updated_at: '2025-12-17T09:40:23.000000Z' 
            */

            return {
              ...response.data.user,
              createdAt: new Date(response.data.user.created_at),
            };
          }

          // If response doesn't have user data, return null (failed auth)
          return null;
        } catch (error) {
          console.error(
            "Authentication failed in Credentials authorize:",
            error
          );
          
          return null;
        }
      },
    }),
  ],
});
