'use client';

import { signIn } from "next-auth/react";
import axios from "@/lib/api/axios";
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`,
        { withCredentials: true }
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      await signIn("credentials", {
        callbackUrl: "/dashboard",
      });

    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
