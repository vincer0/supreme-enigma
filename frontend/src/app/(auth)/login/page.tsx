"use client";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/lib/hooks/useLogin";
import React from "react";

export default function Login() {
  const { login, loading, error } = useLogin();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.currentTarget as typeof e.currentTarget & {
      email: { value: string };
      password: { value: string };
    };
    
    login(target.email.value, target.password.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Login Page</h1>
      <div className="p-6 bg-white rounded shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="email"
            type="text"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
          />
          <Button type="submit" disabled={loading}>
            Login
          </Button>
          <p>{error}</p>
        </form>
      </div>
    </div>
  );
}
