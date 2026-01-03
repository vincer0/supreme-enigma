'use client';

import { Button } from "@/components/ui/button";
import { loginAction } from "./actions";
import { useActionState } from "react";

const initialState: LoginState = {
  message: "",
	success: false
};

export default function Login() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, initialState);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Login Page</h1>
      <div className="p-6 bg-white rounded shadow-md">
        <form action={formAction} className="flex flex-col space-y-4">
          <input name="username" type="text" placeholder="Username" required autoComplete="username"/>
          <input name="password" type="password" placeholder="Password" required autoComplete="current-password"/>
          <Button type="submit" disabled={pending}>Login</Button>
					<p>{state.message}</p>
        </form>
      </div>
    </div>
  );
}
