<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $email = $data['email'];
        $password = $data['password'];

        $user = auth()->attempt([
            'email' => $email,
            'password' => $password,
        ]);
    }

    public function register()
    {
        // Registration logic will be implemented here.
    }
}
