'use client';

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
      <div className="flex flex-col gap-4 p-6 bg-white rounded shadow-md">
        <form action={formAction}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
					<p>{ state.message }</p>
        </form>
      </div>
    </div>
  );
}
