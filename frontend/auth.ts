import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { attemptLogin } from "@/lib/api/auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials, request) {
            // TODO: use zod to validate credentials here if needed and return null if invalid
            // TODO: then remove unknown from credentials
            const response = await attemptLogin(credentials?.email, credentials?.password);

            if (response) {
                const user = await response.data.json();

                return user;
            } else {
                return null;
            }
        }
    }),
  ],
})